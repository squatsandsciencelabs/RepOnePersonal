// TODO: can move this into a saga and pass it the dispatch function as well
// leaving this here for dev speed purposes
import BleManager from 'react-native-ble-manager';

import {
    NativeModules,
    NativeEventEmitter,
    Alert,
    Platform,
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

// https://btprodspecificationrefs.blob.core.windows.net/assigned-numbers/Assigned%20Number%20Types/Assigned%20Numbers.pdf
// BATTERY UUIDs

// 0000180F-0000-1000-8000-00805f9b34fb - 128 bit
// 0x180F - 16 bit
// 180F - short
export const BLE_BATTERY_SERVICE_UUID = '180F';

// 00002a19-0000-1000-8000-00805f9b34fb - 128 bit
// 0x2A19 - 16 bit
// 2A19 - short
export const BLE_BATTERY_CHARACTERISTIC_UUID = '2A19';

const maxFormatVersion = 2;
const MTU_SIZE = 185;

export default async function (store) {
    //native bluetooth
    const Emitter = new NativeEventEmitter(NativeModules.BleManager);

    // scanning
    Emitter.addListener('BleManagerDiscoverPeripheral', args => {
        store.dispatch(DeviceActionCreators.foundDevice(args.name, args.id));
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
            const name =
                ConnectedDeviceStatusSelectors.getConnectedDeviceName(state);
            const identifier =
                ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(
                    state,
                );
            store.dispatch(
                DeviceActionCreators.disconnectedFromDevice(name, identifier),
            );
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
                'A5183278-CA65-45B7-B6C3-A68552F3026D',
                'A5183278-CA65-45B7-B6C3-A68552F3026E',
            ); // get version info
            const batteryPercentageResponse = await BleManager.read(
                args.peripheral,
                BLE_BATTERY_SERVICE_UUID,
                BLE_BATTERY_CHARACTERISTIC_UUID,
            ); // get initial battery percentage
            const typedArray = new Uint8Array(response);
            const data16 = new Uint16Array(typedArray.buffer);

            // TODO: revert api format version
            const apiFormatVersion = 2;
            // const apiFormatVersion = data16[0];
            // if (apiFormatVersion > maxFormatVersion) {
            //     console.tron.log(`api version mismatch`);
            //     Alert.alert(`Please update your RepOne app to use this device.`);
            // }
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
                    batteryPercentageResponse[0] ?? null,
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
                if (characteristic === BLE_BATTERY_CHARACTERISTIC_UUID) {
                    // Battery percentage changed
                    const batteryPercentage = args.value[0] ?? null;
                    store.dispatch(
                        DeviceActionCreators.updateBatteryPercentage(
                            batteryPercentage,
                        ),
                    );
                } else if (
                    characteristic === 'A5183278-CA65-45B7-B6C3-A68552F20273'
                ) {
                    // RepOne reps

                    // variables
                    const typedArray = new Uint8Array(args.value);
                    const data = new Uint16Array(typedArray.buffer);

                    // not sending valid until methods to determine invalid are determined
                    store.dispatch(
                        DeviceActionCreators.receivedLiftData({
                            isValid: true, // TODO: should actually calculate when data could be valid or not, leftover for OB which had clear invalid cases
                            deviceRepID: data[0],
                            repNumber: data[1],
                            averageVelocity: data[2],
                            rom: data[3],
                            peakVelocity: data[4],
                            peakHeight: data[5],
                            duration: data[6],
                            totalSampleCount:
                                formatVersion === 1 ? null : data[7],
                            linear3DAverageVelocity:
                                formatVersion === 1 ? null : data[8],
                            linear3DROM: formatVersion === 1 ? null : data[9],
                        }),
                    );
                } else if (
                    getKratosEnabled() &&
                    characteristic === 'A5183278-CA65-45B7-B6C3-A68552F20284'
                ) {
                    // Kratos Reps

                    // variables
                    const typedArray = new Uint8Array(args.value);
                    const data = new Uint16Array(typedArray.buffer);

                    const json = {
                        isValid: true,
                        repId: data[0],
                        repNumber: data[1],
                        cRom: data[2],
                        cAvgLinearVelocity: data[3],
                        cAvgAngularVelocity: data[4],
                        cPeakLinearVelocity: data[5],
                        cPeakAngularVelocity: data[6],
                        cPeakVelocityLocation: data[7],
                        cDuration: data[8],
                        cMeanAcceleration: data[9],
                        cPeakLinearAcceleration: data[10],
                        cPeakAngularAcceleration: data[11],
                        cPeakPower: data[12],
                        eRom: data[13],
                        eAvgLinearVelocity: data[14],
                        eAvgAngularVelocity: data[15],
                        ePeakLinearVelocity: data[16],
                        ePeakAngularVelocity: data[17],
                        ePeakVelocityLocation: data[18],
                        eDuration: data[19],
                        eMeanAcceleration: data[20],
                        ePeakLinearAcceleration: data[21],
                        ePeakAngularAcceleration: data[22],
                        ePeakPower: data[23],
                    };

                    store.dispatch(
                        DeviceActionCreators.receivedKratosLiftData(json),
                    );

                    // TODO: Remove this logging statement once kratos reps are properly stored in the codebase
                    console.tron.log(`got kratos reps ${JSON.stringify(json)}`);
                } else if (
                    characteristic === 'A5183278-CA65-45B7-B6C3-A68552F20274' &&
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
            // disabled for now, more useful for individual mode not kiosk mode
            // restoreIdentifierKey: 'RepOneKioskRestoreIdentifier',
        });
        BluetoothUtils.setDidBleManagerStart(true);
    } catch (err) {
        // TODO: add error logging here
        console.tron.log(
            `Bluetooth.js start ble manager error ${JSON.stringify(err)}`,
        );
    }
}
