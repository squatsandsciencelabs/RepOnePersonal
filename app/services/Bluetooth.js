// TODO: saga-fy this up
import BleManager from 'react-native-ble-manager';

import {
    NativeModules,
    NativeEventEmitter,
    Alert,
} from 'react-native';
import {
    SAVE_WORKOUT_REP,
    SAVE_HISTORY_REP,
} from 'app/configs+constants/ActionTypes';

import {
    areAllSamplesReceived,
    getBulkData,
    addBulkData,
    updateBulkSampleCount,
    notifyBulkDataReceived,
    requestSampleCount,
} from 'app/redux/sagas/BulkDataSaga';
import * as DeviceActionCreators from 'app/redux/shared_actions/DeviceActionCreators';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

const maxFormatVersion = 2;

export default function (store) {
    //native bluetooth
    const Emitter = new NativeEventEmitter(NativeModules.BleManager);

    // scanning
    Emitter.addListener('BleManagerDiscoverPeripheral', (args) => {
        store.dispatch(DeviceActionCreators.foundDevice(args.name, args.id));
    });

    // connection status
    Emitter.addListener('BleManagerDidUpdateState', (args) => {
        if (args.state !== 'on') {
            store.dispatch(DeviceActionCreators.bluetoothIsOff());
        } else {
            // TODO: clearn this up by having a bluetooth on action instead of disconnected
            // should have sagas listening to it
            // note that this is basically the same code as the disconnect listener below
            const state = store.getState();
            const name = ConnectedDeviceStatusSelectors.getConnectedDeviceName(state);
            const identifier = ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
            store.dispatch(DeviceActionCreators.disconnectedFromDevice(name, identifier));
        }
    });

    Emitter.addListener('BleManagerDisconnectPeripheral', (args) => {
        const state = store.getState();
        const name = ConnectedDeviceStatusSelectors.getConnectedDeviceName(state);
        const identifier = ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
        store.dispatch(DeviceActionCreators.disconnectedFromDevice(name, identifier));
    });

    // NOTE: this does not exist in the ble-manager, so doing it in device action creators instead
    // Emitter.addListener('Connecting', (data) => {
    //     store.dispatch(DeviceActionCreators.connectingToDevice(data.name, data.identifier));
    // });

    Emitter.addListener('BleManagerConnectPeripheral', async (args) => {
        // observe reps
        try {
            await BleManager.retrieveServices(args.peripheral);
            await BleManager.startNotification(args.peripheral, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20273'); // reps
            // await BleManager.startNotification(args.peripheral, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274'); // bulk data
            const response = await BleManager.read(args.peripheral, 'A5183278-CA65-45B7-B6C3-A68552F3026D', 'A5183278-CA65-45B7-B6C3-A68552F3026E'); // get version info
            const typedArray = new Uint8Array(response);
            const data16 = new Uint16Array(typedArray.buffer);
            if (data16[0] > maxFormatVersion) {
                console.tron.log(`api version mismatch`);
                Alert.alert(`Please update your RepOne app to use this device.`);
            }
            if (data16[0] >= 2) {
                // end cal on startup if it's format 2
                await BleManager.writeWithoutResponse(args.peripheral, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20281', 'endcal');
            }
            store.dispatch(DeviceActionCreators.connectedToDevice(args.peripheral, data16[0], `${data16[1]}.${data16[2]}.${data16[3]}`));
        } catch (err) {
            // TODO: add error logging here
            console.tron.log(`Error setting up service after connecting to peripheral ${err}`);
        }
    });

    // data
    Emitter.addListener('BleManagerDidUpdateValueForCharacteristic', async (args) => {
        // api version check
        const state = store.getState();
        const formatVersion = ConnectedDeviceStatusSelectors.getAPIFormatVersion(state);
        if (formatVersion > maxFormatVersion) {
            return;
        }

        // 
        if (args.characteristic === 'A5183278-CA65-45B7-B6C3-A68552F20273') {
            // reps
            const typedArray = new Uint8Array(args.value);
            const data = new Uint16Array(typedArray.buffer);

            // not sending valid until methods to determine invalid are determined
            store.dispatch(DeviceActionCreators.receivedLiftData({
                isValid: true, // TODO: should actually calculate when data could be valid
                deviceRepID: data[0],
                repNumber: data[1],
                averageVelocity: data[2],
                rom: data[3],
                peakVelocity: data[4],
                peakHeight: data[5],
                duration: data[6],
                linear3DAverageVelocity: formatVersion === 1 ? null : data[8],
                linear3DROM: formatVersion === 1 ? null : data[9],
            }));
        } else if (args.characteristic === 'A5183278-CA65-45B7-B6C3-A68552F20274') {
            // bulk data
            const typedArray = new Uint8Array(args.value);
            const data = new DataView(typedArray.buffer);
            try {
                if (typedArray.length === 4) {
                    // this is sample count
                    const deviceRepID = data.getUint16(0, true);
                    const totalSampleCount = data.getUint16(2, true);
                    updateBulkSampleCount(deviceRepID, totalSampleCount);
                } else {
                    const deviceIdentifier = ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
                    const deviceRepID = data.getUint16(0, true);
                    if (!areAllSamplesReceived(deviceRepID)) {
                        const sampleID = data.getUint16(2, true);
                        const time = data.getUint32(4, true);
                        const x = data.getUint16(8, true);
                        const y = data.getUint16(10, true);
                        const z = data.getUint16(12, true);

                        // save
                        addBulkData(deviceRepID, sampleID, time, x, y, z);

                        // request sample count if needed
                        requestSampleCount(deviceIdentifier, deviceRepID);
                    }

                    const completedData = getBulkData(deviceRepID);
                    if (completedData !== false) {
                        if (completedData !== true) {
                            // has real object, save it
                            const repIndex = completedData.repIndex;
                            const setID = completedData.setID;
                            const bulkData = completedData.bulkData;
                            if (SetsSelectors.getHistorySet(state, setID)) {
                                // history has it
                                store.dispatch({
                                    type: SAVE_HISTORY_REP,
                                    setID,
                                    repIndex,
                                    bulkData,
                                });
                            } else if (SetsSelectors.getWorkoutSet(state, setID)) {
                                // workout has it
                                store.dispatch({
                                    type: SAVE_WORKOUT_REP,
                                    setID,
                                    repIndex,
                                    bulkData,
                                });
                            } else {
                                console.tron.log(`No set found for rep with device id ${deviceRepID}`);
                            }
                        }
                    
                        // tell the sensor it's okay
                        if (!deviceIdentifier) {
                            console.tron.log(`Unable to write success message to device as no device identifier found`);
                            return;
                        }
                        await notifyBulkDataReceived(deviceIdentifier, deviceRepID);
                   }
                 }
            } catch (err) {
                console.tron.log(`Error dispatching add bulk data ${err}`);
            }
        }
    });

    try {
        // start the manager
        BleManager.start({
            showAlert: false,
            // disabled for now, more useful for individual mode not kiosk mode
            // restoreIdentifierKey: 'RepOneKioskRestoreIdentifier',
        });
    } catch(err) {
        // TODO: add error logging here
        console.tron.log(`BluetoothSaga error ${JSON.stringify(err)}`);
    }
}

