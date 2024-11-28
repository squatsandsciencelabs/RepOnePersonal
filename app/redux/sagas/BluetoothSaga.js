// might move bulk data stuff into this guy because fuck it

import { takeEvery, select, all, apply } from 'redux-saga/effects';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import { CONNECTED_TO_DEVICE } from 'app/configs+constants/ActionTypes';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import {
    BLE_BATTERY_SERVICE,
    BLE_BATTERY_CHARACTERISTIC,
    REP_ONE_TETHER_REP_SERVICE,
    REP_ONE_TETHER_BULK_DATA_CHARACTERISTIC,
    REP_ONE_TETHER_BULK_DATA_START_CHARACTERISTIC,
    REP_ONE_TETHER_BULK_DATA_CONTROL_CHARACTERISTIC,
    REP_ONE_TETHER_CALIBRATION_CHARACTERISTIC,
} from 'app/configs+constants/BluetoothAPI';

export default function* BluetoothSaga() {
    yield all([takeEvery(CONNECTED_TO_DEVICE, setupServices)]);
}

function* setupServices(action) {
    try {
        // listen for battery changes
        try {
            yield apply(BleManager, BleManager.startNotification, [
                action.deviceIdentifier,
                BLE_BATTERY_SERVICE,
                BLE_BATTERY_CHARACTERISTIC,
            ]);
        } catch (err) {
            console.tron.log(
                `listening for battery failed, might be older firmware that lacks it ${err}`,
            );
        }

        // get device fmaily
        const deviceFamily = yield select(
            ConnectedDeviceStatusSelectors.getConnectedDeviceFamily,
        );

        // listen for reps
        const repService = yield select(
            ConnectedDeviceStatusSelectors.getConnectedDeviceRepService,
        );
        const repCharacteristic = yield select(
            ConnectedDeviceStatusSelectors.getConnectedDeviceRepCharacteristic,
        );
        yield apply(BleManager, BleManager.startNotification, [
            action.deviceIdentifier,
            repService,
            repCharacteristic,
        ]);

        // NOTE: Disable this for testing purposes
        // api format 2 check
        // if (action.apiFormatVersion < 2) {
        //     return;
        // }

        // bulk
        console.tron.log(`bulk enabled ${OpenBarbellConfig.bulkEnabled}`);
        console.tron.log(`deviceFamily ${deviceFamily}`);
        if (OpenBarbellConfig.bulkEnabled && deviceFamily === 'REP_ONE') {
            console.tron.log(`litsen for bulk`);
            // listen for bulk data
            yield apply(BleManager, BleManager.startNotification, [
                action.deviceIdentifier,
                REP_ONE_TETHER_REP_SERVICE,
                REP_ONE_TETHER_BULK_DATA_CHARACTERISTIC,
            ]);

            // write 1 for bulk data
            // let writeData = stringToBytes('1');
            // let deviceIdentifier = null;
            // while (true) {
            //     try {
            //         // fail out upon disconnect
            //         deviceIdentifier = yield select(
            //             ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
            //         );
            //         if (!deviceIdentifier) {
            //             console.tron.log(
            //                 `not connected, giving up on sending 1 to write data`,
            //             );
            //             return;
            //         }

            //         // write
            //         yield apply(BleManager, BleManager.write, [
            //             deviceIdentifier,
            //             REP_ONE_TETHER_REP_SERVICE,
            //             REP_ONE_TETHER_BULK_DATA_START_CHARACTERISTIC,
            //             writeData,
            //         ]);

            //         // success, bail
            //         break;
            //     } catch (err) {
            //         console.tron.log(
            //             `Error writing string 1, trying again ${err.toString()}`,
            //         );
            //     }
            // }
        }

        // calibration
        // if (
        //     OpenBarbellConfig.calibrationEnabled &&
        //     deviceFamily === 'REP_ONE'
        // ) {
        //     // end cal on startup if it's format 2
        //     writeData = stringToBytes('endcal');
        //     while (true) {
        //         try {
        //             // fail out upon disconnect
        //             deviceIdentifier = yield select(
        //                 ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
        //             );
        //             if (!deviceIdentifier) {
        //                 console.tron.log(
        //                     `not connected, giving up on sending endcal`,
        //                 );
        //                 return;
        //             }

        //             // write
        //             yield apply(BleManager, BleManager.write, [
        //                 action.deviceIdentifier,
        //                 REP_ONE_TETHER_REP_SERVICE,
        //                 REP_ONE_TETHER_CALIBRATION_CHARACTERISTIC,
        //                 writeData,
        //             ]);

        //             // success, bail
        //             break;
        //         } catch (err) {
        //             console.tron.log(
        //                 `Error writing endcal, trying again ${err.toString()}`,
        //             );
        //         }
        //     }
        // }
    } catch (err) {
        console.tron.log(
            `Error setting up service after connecting to peripheral ${err}`,
        );
    }
}
