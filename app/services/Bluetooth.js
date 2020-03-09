// TODO: saga-fy this up

import {
    NativeModules,
    NativeEventEmitter,
    Alert,
} from 'react-native';
import { ADD_BULK_DATA } from 'app/configs+constants/ActionTypes';
import BleManager from 'react-native-ble-manager';

import * as DeviceActionCreators from 'app/redux/shared_actions/DeviceActionCreators';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';

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
            await BleManager.startNotification(args.peripheral, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274'); // bulk data
            const response = await BleManager.read(args.peripheral, 'A5183278-CA65-45B7-B6C3-A68552F3026D', 'A5183278-CA65-45B7-B6C3-A68552F3026E');
            const typedArray = new Uint8Array(response);
            const data16 = new Uint16Array(typedArray.buffer);
            if (data16[0] > 1) {
                console.tron.log(`api version mismatch`);
                Alert.alert(`Please update your RepOne app to use this device.`);
            }
            store.dispatch(DeviceActionCreators.connectedToDevice(args.peripheral, data16[0], `${data16[1]}.${data16[2]}.${data16[3]}`));
        } catch (err) {
            // TODO: add error logging here
            console.tron.log(`Error setting up service after connecting to peripheral ${err}`);
        }
    });

    // data
    Emitter.addListener('BleManagerDidUpdateValueForCharacteristic', (args) => {
        // api version check
        const state = store.getState();
        const formatVersion = ConnectedDeviceStatusSelectors.getAPIFormatVersion(state);
        if (formatVersion > 1) {
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
            }));
        } else if (args.characteristic === 'A5183278-CA65-45B7-B6C3-A68552F20274') {
            // bulk data
            const typedArray = new Uint8Array(args.value);
            const data = new Uint16Array(typedArray.buffer);

            store.dispatch({
                type: ADD_BULK_DATA,
                deviceRepID: data[0],
                sampleID: data[1],
                time: data[2],
                x: data[3],
                y: data[4],
                z: data[5],
            });
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

