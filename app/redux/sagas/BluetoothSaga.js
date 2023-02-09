// might move bulk data stuff into this guy because fuck it

import { takeEvery, select, all, apply } from 'redux-saga/effects';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import { CONNECTED_TO_DEVICE } from 'app/configs+constants/ActionTypes';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import {
    BLE_BATTERY_CHARACTERISTIC_UUID,
    BLE_BATTERY_SERVICE_UUID,
} from 'app/services/Bluetooth';

export default function* BluetoothSaga() {
    yield all([takeEvery(CONNECTED_TO_DEVICE, setupServices)]);
}

function* setupServices(action) {
    try {
        // listen for battery changes
        yield apply(BleManager, BleManager.startNotification, [
            action.deviceIdentifier,
            BLE_BATTERY_SERVICE_UUID,
            BLE_BATTERY_CHARACTERISTIC_UUID,
        ]);

        // listen for reps
        const repCharacteristic = yield select(
            ConnectedDeviceStatusSelectors.getConnectedDeviceRepCharacteristic,
        );
        yield apply(BleManager, BleManager.startNotification, [
            action.deviceIdentifier,
            'A5183278-CA65-45B7-B6C3-A68552F2026D',
            repCharacteristic,
        ]);

        // api format 2 check
        if (action.apiFormatVersion < 2) {
            return;
        }

        // bulk
        if (OpenBarbellConfig.bulkEnabled) {
            // listen for bulk data
            yield apply(BleManager, BleManager.startNotification, [
                action.deviceIdentifier,
                'A5183278-CA65-45B7-B6C3-A68552F2026D',
                'A5183278-CA65-45B7-B6C3-A68552F20274',
            ]);

            // write 1 for bulk data
            let writeData = stringToBytes('1');
            let deviceIdentifier = null;
            while (true) {
                try {
                    // fail out upon disconnect
                    deviceIdentifier = yield select(
                        ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
                    );
                    if (!deviceIdentifier) {
                        console.tron.log(
                            `not connected, giving up on sending 1 to write data`,
                        );
                        return;
                    }

                    // write
                    yield apply(BleManager, BleManager.write, [
                        deviceIdentifier,
                        'A5183278-CA65-45B7-B6C3-A68552F2026D',
                        'A5183278-CA65-45B7-B6C3-A68552F20276',
                        writeData,
                    ]);

                    // success, bail
                    break;
                } catch (err) {
                    console.tron.log(
                        `Error writing 1, trying again ${err.toString()}`,
                    );
                }
            }
        }

        // calibration
        if (OpenBarbellConfig.calibrationEnabled) {
            // end cal on startup if it's format 2
            writeData = stringToBytes('endcal');
            while (true) {
                try {
                    // fail out upon disconnect
                    deviceIdentifier = yield select(
                        ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
                    );
                    if (!deviceIdentifier) {
                        console.tron.log(
                            `not connected, giving up on sending endcal`,
                        );
                        return;
                    }

                    // write
                    yield apply(BleManager, BleManager.write, [
                        action.deviceIdentifier,
                        'A5183278-CA65-45B7-B6C3-A68552F2026D',
                        'A5183278-CA65-45B7-B6C3-A68552F20281',
                        writeData,
                    ]);

                    // success, bail
                    break;
                } catch (err) {
                    console.tron.log(
                        `Error writing endcal, trying again ${err.toString()}`,
                    );
                }
            }
        }
    } catch (err) {
        console.tron.log(
            `Error setting up service after connecting to peripheral ${err}`,
        );
    }
}
