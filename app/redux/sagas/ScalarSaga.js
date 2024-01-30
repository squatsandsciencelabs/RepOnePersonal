// NOTE: This only works with RepOne Tether

import {
    take,
    takeEvery,
    select,
    put,
    call,
    all,
    apply,
} from 'redux-saga/effects';
import BleManager from 'react-native-ble-manager';
import { bytesToString } from 'convert-string';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import {
    ATTEMPT_LOG_REP_START_POSITION,
    ATTEMPT_LOG_REP_END_POSITION,
    LOG_REP_START_POSITION,
    LOG_REP_END_POSITION,
} from 'app/configs+constants/ActionTypes';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import {
    REP_ONE_TETHER_REP_SERVICE,
    REP_ONE_TETHER_SCALAR_TEST_CHARACTERISTIC,
} from 'app/configs+constants/BluetoothAPI';

export default function* ScalarSaga() {
    if (OpenBarbellConfig.scalarEnabled) {
        yield all([
            takeEvery(ATTEMPT_LOG_REP_START_POSITION, logStart),
            takeEvery(ATTEMPT_LOG_REP_END_POSITION, logEnd),
        ]);
    }
}

function* logStart(action) {
    try {
        const deviceIdentifier = yield select(
            ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
        );
        const formatVersion = yield select(
            ConnectedDeviceStatusSelectors.getAPIFormatVersion,
        );
        if (deviceIdentifier && formatVersion && formatVersion >= 2) {
            const response = yield apply(BleManager, BleManager.read, [
                deviceIdentifier,
                REP_ONE_TETHER_REP_SERVICE,
                REP_ONE_TETHER_SCALAR_TEST_CHARACTERISTIC,
            ]);

            let responseString = bytesToString(response);
            responseString = responseString.replace(/\s+/g, '');
            const array = responseString.split(/,|:/);
            const x = array[array.length - 5];
            const y = array[array.length - 3];
            const z = array[array.length - 1];
            if (x !== 'nan' && y !== 'nan' && z !== 'nan') {
                yield put({
                    type: LOG_REP_START_POSITION,
                    x,
                    y,
                    z,
                });
            } else {
                console.tron.log(`ignoring nan for log start position`);
            }
        } else {
            console.tron.log(
                `skipping get rep start format version ${formatVersion} is not >= 2`,
            );
        }
    } catch (err) {
        console.tron.log(`failed read start position ${err.toString()}`);
    }
}

function* logEnd(action) {
    try {
        const deviceIdentifier = yield select(
            ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
        );
        const formatVersion = yield select(
            ConnectedDeviceStatusSelectors.getAPIFormatVersion,
        );
        if (deviceIdentifier && formatVersion && formatVersion >= 2) {
            const response = yield apply(BleManager, BleManager.read, [
                deviceIdentifier,
                REP_ONE_TETHER_REP_SERVICE,
                REP_ONE_TETHER_SCALAR_TEST_CHARACTERISTIC,
            ]);

            let responseString = bytesToString(response);
            responseString = responseString.replace(/\s+/g, '');
            const array = responseString.split(/,|:/);
            const x = array[array.length - 5];
            const y = array[array.length - 3];
            const z = array[array.length - 1];
            if (x !== 'nan' && y !== 'nan' && z !== 'nan') {
                yield put({
                    type: LOG_REP_END_POSITION,
                    x,
                    y,
                    z,
                });
            } else {
                console.tron.log(`ignoring nan for log end position`);
            }
        } else {
            console.tron.log(
                `skipping get rep end format version ${formatVersion} is not >= 2`,
            );
        }
    } catch (err) {
        console.tron.log(`failed read end position ${err.toString()}`);
    }
}
