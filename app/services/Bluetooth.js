// TODO: can move this into a saga and pass it the dispatch function as well
// leaving this here for dev speed purposes
import BleManager from 'react-native-ble-manager';

import {
    NativeModules,
    NativeEventEmitter,
    Platform,
    AppState,
    Alert,
} from 'react-native';
import {
    SAVE_WORKOUT_REP,
    SAVE_HISTORY_REP,
} from 'app/configs+constants/ActionTypes';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import { getBulkData, addBulkData } from 'app/redux/sagas/BulkDataSaga';
import * as DeviceActionCreators from 'app/redux/shared_actions/DeviceActionCreators';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';
import * as BluetoothUtils from 'app/utility/BluetoothUtils';
import { getDeviceDisplayName } from 'app/utility/SensorUtils';
import {
    DEVICE_SERVICE,
    DEVICE_INFO_CHARACTERISTIC,
    BLE_BATTERY_SERVICE,
    BLE_BATTERY_CHARACTERISTIC,
    REP_ONE_TETHER_REP_SUMMARY_CHARACTERISTIC,
    REP_ONE_TETHER_BULK_DATA_CHARACTERISTIC,
    KRATOS_REP_SUMMARY_CHARACTERISTIC,
} from 'app/configs+constants/BluetoothAPI';

const maxFormatVersion = 2;
const MTU_SIZE = 185;

export default async function (store) {
    //native bluetooth
    const Emitter = new NativeEventEmitter(NativeModules.BleManager);

    // scanning
    Emitter.addListener('BleManagerDiscoverPeripheral', args => {
        store.dispatch(
            DeviceActionCreators.foundDevice(
                getDeviceDisplayName(args.name),
                args.id,
            ),
        );
    });

    // connection status
    Emitter.addListener('BleManagerDidUpdateState', args => {
        if (args.state !== 'on') {
            store.dispatch(DeviceActionCreators.bluetoothIsOff());
        } else {
            // TODO: clearn this up by having a bluetooth on action instead of disconnected
            // should have sagas listening to it
            // note that this is basically the same code as the disconnect listener below
            const state = store.getState();
            const isBLEStateRestored =
                ConnectedDeviceStatusSelectors.getIsBLEStateRestored(state);

            // Don't disconnect from the device if the state is restored
            if (!isBLEStateRestored) {
                const name =
                    ConnectedDeviceStatusSelectors.getConnectedDeviceName(
                        state,
                    );
                const identifier =
                    ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(
                        state,
                    );
                store.dispatch(
                    DeviceActionCreators.disconnectedFromDevice(
                        name,
                        identifier,
                    ),
                );
            }
        }
    });

    Emitter.addListener('BleManagerDisconnectPeripheral', args => {
        const state = store.getState();
        const name =
            ConnectedDeviceStatusSelectors.getConnectedDeviceName(state);
        const identifier =
            ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
        store.dispatch(
            DeviceActionCreators.disconnectedFromDevice(name, identifier),
        );
    });

    // NOTE: this does not exist in the ble-manager, so doing it in device action creators instead
    // Emitter.addListener('Connecting', (data) => {
    //     store.dispatch(DeviceActionCreators.connectingToDevice(data.name, data.identifier));
    // });

    Emitter.addListener('BleManagerConnectPeripheral', async args => {
        // observe reps
        try {
            // get version info
            await BleManager.retrieveServices(args.peripheral);
            const response = await BleManager.read(
                args.peripheral,
                DEVICE_SERVICE,
                DEVICE_INFO_CHARACTERISTIC,
            );

            // get initial battery percentage
            let batteryPercentageResponse = null;
            try {
                batteryPercentageResponse = await BleManager.read(
                    args.peripheral,
                    BLE_BATTERY_SERVICE,
                    BLE_BATTERY_CHARACTERISTIC,
                );
            } catch (err) {
                console.tron.log(
                    `battery read failed, ignoring as may be older sensor ${err}`,
                );
            }
            const typedArray = new Uint8Array(response);
            const data16 = new Uint16Array(typedArray.buffer);

            const apiFormatVersion = data16[0];

            if (apiFormatVersion > maxFormatVersion) {
                console.tron.log(`api version mismatch`);
                Alert.alert(
                    `Please update your RepOne app to use this device.`,
                );
            }

            if (Platform.OS !== 'ios') {
                try {
                    const mtu = BleManager.requestMTU(
                        args.peripheral,
                        MTU_SIZE,
                    );
                    console.tron.log(`MTU size changed to ${mtu} bytes`);
                } catch (err) {
                    console.tron.log(`Couldn't change MTU size ${err}`);
                }
            }

            // connected
            store.dispatch(
                DeviceActionCreators.connectedToDevice(
                    args.peripheral,
                    apiFormatVersion,
                    `${data16[1]}.${data16[2]}.${data16[3]}`,
                    (batteryPercentageResponse &&
                        batteryPercentageResponse.length &&
                        batteryPercentageResponse.length > 0 &&
                        batteryPercentageResponse[0]) ??
                        null,
                ),
            );
        } catch (err) {
            // TODO: add error logging here
            console.tron.log(
                `Error setting up service after connecting to peripheral ${err}`,
            );
        }
    });

    // data
    Emitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        async args => {
            try {
                // api version check
                const state = store.getState();
                const formatVersion =
                    ConnectedDeviceStatusSelectors.getAPIFormatVersion(state);
                if (formatVersion > maxFormatVersion) {
                    return;
                }
                const characteristic = args.characteristic.toUpperCase();

                // process it
                // done here instead of actions to a saga to save on number of actions
                // especially important for bulk data as it gets spammed
                if (characteristic === BLE_BATTERY_CHARACTERISTIC) {
                    // Battery percentage changed
                    const batteryPercentage = args.value[0] ?? null;
                    store.dispatch(
                        DeviceActionCreators.updateBatteryPercentage(
                            batteryPercentage,
                        ),
                    );
                } else if (
                    characteristic === REP_ONE_TETHER_REP_SUMMARY_CHARACTERISTIC
                ) {
                    // RepOne reps

                    // variables
                    const typedArray = new Uint8Array(args.value);
                    const data = new Uint16Array(typedArray.buffer);

                    const json = formConcentricRepDataJson(data, formatVersion);

                    // not sending valid until methods to determine invalid are determined
                    store.dispatch(DeviceActionCreators.receivedLiftData(json));
                } else if (
                    getKratosEnabled() &&
                    characteristic === KRATOS_REP_SUMMARY_CHARACTERISTIC
                ) {
                    // Kratos Reps

                    // variables
                    const typedArray = new Uint8Array(args.value);
                    const data = new Uint16Array(typedArray.buffer);

                    const json = formConcentricEccentricRepDataJson(data);

                    store.dispatch(
                        DeviceActionCreators.receivedKratosLiftData(json),
                    );

                    // TODO: Remove this logging statement once kratos reps are properly stored in the codebase
                    console.tron.log(`got kratos reps ${JSON.stringify(json)}`);
                } else if (
                    characteristic ===
                        REP_ONE_TETHER_BULK_DATA_CHARACTERISTIC &&
                    OpenBarbellConfig.bulkEnabled
                ) {
                    // bulk data

                    try {
                        // parse data
                        const typedArray = new Uint8Array(args.value);
                        const data = new DataView(typedArray.buffer);
                        const deviceRepID = data.getUint16(0, true);
                        const sampleID = data.getUint16(2, true);
                        const time = data.getUint32(4, true);
                        const x = data.getInt16(8, true);
                        const y = data.getInt16(10, true);
                        const z = data.getInt16(12, true);

                        // add bulk data
                        addBulkData(
                            typedArray,
                            deviceRepID,
                            sampleID,
                            time,
                            x,
                            y,
                            z,
                        );

                        // complete check
                        const completedData = getBulkData(deviceRepID);
                        if (completedData !== false && completedData !== true) {
                            // has real object, save it
                            const repIndex = completedData.repIndex;
                            const setID = completedData.setID;
                            const bulkData = completedData.bulkData;

                            // save to store
                            if (SetsSelectors.getHistorySet(state, setID)) {
                                // history has it
                                store.dispatch({
                                    type: SAVE_HISTORY_REP,
                                    setID,
                                    repIndex,
                                    bulkData,
                                });
                            } else if (
                                SetsSelectors.getWorkoutSet(state, setID)
                            ) {
                                // workout has it
                                store.dispatch({
                                    type: SAVE_WORKOUT_REP,
                                    setID,
                                    repIndex,
                                    bulkData,
                                });
                            } else {
                                console.tron.log(
                                    `No set found for rep with device id ${deviceRepID}`,
                                );
                            }
                        }
                    } catch (err) {
                        console.tron.log(
                            `Error dispatching add bulk data ${err}`,
                        );
                    }
                }
            } catch (err) {
                console.tron.log(
                    `Error processing stuff from bluetooth ${err}`,
                );
            }
        },
    );

    Emitter.addListener(
        'BleManagerCentralManagerWillRestoreState',
        async args => {
            const appState = AppState.currentState;
            // if the app is in the background, restore the state - it means it was invoked by the peripheral sending data
            // if the app is reopened by user - don't restore state as it will re-add rep to the workout (duplicate last received data)
            if (appState === 'active') {
                return;
            }
            // updating connected device state so that other handler doesn't call `disconnectDevice` action
            store.dispatch(DeviceActionCreators.restoredBLEState());
            // Restore the state of each connected peripheral
            for (const peripheral of args.peripherals) {
                try {
                    // searching for the rep data
                    const version = peripheral.characteristics.find(
                        c =>
                            c.characteristic.toUpperCase() ===
                            DEVICE_INFO_CHARACTERISTIC,
                    ).value.bytes;

                    const typedArray = new Uint8Array(version);
                    const data16 = new Uint16Array(typedArray.buffer);

                    const formatVersion = data16[0];

                    const repOneCharacteristic =
                        peripheral.characteristics.find(
                            c =>
                                c.characteristic.toUpperCase() ===
                                REP_ONE_TETHER_REP_SUMMARY_CHARACTERISTIC,
                        );

                    const kratosCharacteristic =
                        peripheral.characteristics.find(
                            c =>
                                c.characteristic.toUpperCase() ===
                                KRATOS_REP_SUMMARY_CHARACTERISTIC,
                        );

                    if (repOneCharacteristic) {
                        const typedArray = new Uint8Array(
                            repOneCharacteristic.value.bytes,
                        );
                        const data = new Uint16Array(typedArray.buffer);

                        const json = formConcentricRepDataJson(
                            data,
                            formatVersion,
                        );

                        store.dispatch(
                            DeviceActionCreators.receivedLiftData(json),
                        );
                    } else if (kratosCharacteristic) {
                        const typedArray = new Uint8Array(
                            kratosCharacteristic.value.bytes,
                        );
                        const data = new Uint16Array(typedArray.buffer);

                        const json = formConcentricEccentricRepDataJson(data);

                        store.dispatch(
                            DeviceActionCreators.receivedKratosLiftData(json),
                        );
                    }

                    store.dispatch(
                        DeviceActionCreators.connectDevice(
                            getDeviceDisplayName(peripheral.name),
                            peripheral.id,
                        ),
                    );

                    const isPeripheralConnected =
                        await BleManager.isPeripheralConnected(peripheral.id);

                    if (isPeripheralConnected) {
                        store.dispatch(
                            DeviceActionCreators.connectedToDevice(
                                peripheral.id,
                                formatVersion,
                                `${data16[1]}.${data16[2]}.${data16[3]}`,
                                null,
                            ),
                        );
                    } else {
                        store.dispatch(
                            DeviceActionCreators.disconnectedFromDevice(
                                getDeviceDisplayName(peripheral.name),
                                peripheral.id,
                            ),
                        );
                    }
                } catch (err) {
                    console.tron.log(`Error while state restoration ${err}`);
                }
            }
        },
    );

    try {
        if (Platform.OS !== 'ios') {
            const allBluetoothPermissionGranted =
                await BluetoothUtils.checkBluetoothPermissionsAndroid();

            if (!allBluetoothPermissionGranted) {
                throw new Error('Bluetooth permissions are missing');
            }
        }
        // start the manager
        await BleManager.start({
            showAlert: false,
            // store restoration identifier
            restoreIdentifierKey: 'RepOneRestoreIdentifier',
        });
        BluetoothUtils.setDidBleManagerStart(true);
    } catch (err) {
        // TODO: add error logging here
        console.tron.log(
            `Bluetooth.js start ble manager error ${JSON.stringify(err)}`,
        );
    }
}

// HELPERS

const formConcentricRepDataJson = (data, formatVersion) => ({
    isValid: true, // TODO: should actually calculate when data could be valid or not, leftover for OB which had clear invalid cases
    deviceRepID: data[0],
    repNumber: data[1],
    averageVelocity: data[2],
    rom: data[3],
    peakVelocity: data[4],
    peakHeight: data[5],
    duration: data[6],
    totalSampleCount: formatVersion === 1 ? null : data[7],
    linear3DAverageVelocity: formatVersion === 1 ? null : data[8],
    linear3DROM: formatVersion === 1 ? null : data[9],
});

const formConcentricEccentricRepDataJson = data => ({
    isValid: true,
    repId: data[0],
    repNumber: data[1],
    cRom: data[2],
    cAvgLinearVelocity: data[3],
    cPeakLinearVelocity: data[4],
    cDuration: data[5],
    cMeanAcceleration: data[6],
    cPeakLinearAcceleration: data[7],
    cPartialPeakForce: data[8],
    cPartialPeakPower: data[9],
    cPartialMeanForce: data[10],
    cPartialMeanPower: data[11],
    eRom: data[12],
    eAvgLinearVelocity: data[13],
    ePeakLinearVelocity: data[14],
    eDuration: data[15],
    eMeanAcceleration: data[16],
    ePeakLinearAcceleration: data[17],
    ePartialPeakForce: data[18],
    ePartialPeakPower: data[19],
    ePartialMeanForce: data[20],
    ePartialMeanPower: data[21],
});
