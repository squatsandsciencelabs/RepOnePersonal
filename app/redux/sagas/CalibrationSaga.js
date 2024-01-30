// NOTE: This only works for RepOne tether
// If we want to calibrate other devices, this needs to be modified

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
import Toast from 'react-native-root-toast';
import { stringToBytes } from 'convert-string';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import {
    START_CALIBRATION,
    FINISH_CALIBRATION,
    CANCEL_CALIBRATION,
    DISCONNECTED_FROM_DEVICE,
    RESET_CALIBRATION,
} from 'app/configs+constants/ActionTypes';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as CalibrationSelectors from 'app/redux/selectors/CalibrationSelectors';
import {
    REP_ONE_TETHER_REP_SERVICE,
    REP_ONE_TETHER_CALIBRATION_CHARACTERISTIC,
} from 'app/configs+constants/BluetoothAPI';

var calibrating = false;

export default function* CalibrationSaga() {
    if (OpenBarbellConfig.calibrationEnabled) {
        yield all([
            takeEvery(START_CALIBRATION, startCalibration),
            takeEvery(FINISH_CALIBRATION, finishCalibration),
            takeEvery(DISCONNECTED_FROM_DEVICE, forceEndCalibration),
            takeEvery(RESET_CALIBRATION, resetCalibration),
            // note: shoulnd't need cancel calibration as cancel is disabled once you tap start
        ]);
    }
}

function* startCalibration(action) {
    calibrating = false;
    while (true) {
        try {
            const deviceIdentifier = yield select(
                ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
            );
            const formatVersion = yield select(
                ConnectedDeviceStatusSelectors.getAPIFormatVersion,
            );
            const deviceFamily = yield select(
                ConnectedDeviceStatusSelectors.getConnectedDeviceFamily,
            );
            if (
                deviceIdentifier &&
                formatVersion &&
                formatVersion >= 2 &&
                deviceFamily === 'REP_ONE'
            ) {
                const writeData = stringToBytes('startcal');
                yield apply(BleManager, BleManager.write, [
                    deviceIdentifier,
                    REP_ONE_TETHER_REP_SERVICE,
                    REP_ONE_TETHER_CALIBRATION_CHARACTERISTIC,
                    writeData,
                ]);
            } else {
                console.tron.log(
                    `skipping get start calibration as either not connected to ${deviceIdentifier}, format version ${formatVersion} is not >= 2, or device family ${deviceFamily} is wrong`,
                );
            }
            calibrating = true;
            break; // exit the loop due to success
        } catch (err) {
            console.tron.log(
                `failed to start calibration ${err.toString()}, trying again`,
            );
        }
    }
}

function* finishCalibration(action) {
    while (true) {
        try {
            const deviceIdentifier = yield select(
                ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
            );
            const formatVersion = yield select(
                ConnectedDeviceStatusSelectors.getAPIFormatVersion,
            );
            const deviceFamily = yield select(
                ConnectedDeviceStatusSelectors.getConnectedDeviceFamily,
            );
            if (
                deviceIdentifier &&
                formatVersion &&
                formatVersion >= 2 &&
                deviceFamily === 'REP_ONE'
            ) {
                const writeData = stringToBytes('endcal');
                yield apply(BleManager, BleManager.write, [
                    deviceIdentifier,
                    REP_ONE_TETHER_REP_SERVICE,
                    REP_ONE_TETHER_CALIBRATION_CHARACTERISTIC,
                    writeData,
                ]);
                toast(
                    'Your RepOne Sensor is now calibrated for accurate 3D readings.',
                );
            } else {
                console.tron.log(
                    `skipping finish calibration as either not connected to ${deviceIdentifier}, format version ${formatVersion} is not >= 2, or device family ${deviceFamily} is wrong`,
                );
            }
            calibrating = false;
            break; // exit the loop due to success
        } catch (err) {
            console.tron.log(
                `failed to end calibration ${err.toString()}, trying again`,
            );
        }
    }
}

function* forceEndCalibration(action) {
    const isModalShowing = yield select(CalibrationSelectors.getIsModalShowing);
    if (!isModalShowing) {
        return;
    }

    calibrating = false;
    toast(
        'You disconnected from your sensor, please reconnect and try calibrating again',
    );
    yield put({ type: CANCEL_CALIBRATION });
}

function* resetCalibration(action) {
    while (true) {
        try {
            const deviceIdentifier = yield select(
                ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier,
            );
            const formatVersion = yield select(
                ConnectedDeviceStatusSelectors.getAPIFormatVersion,
            );
            const deviceFamily = yield select(
                ConnectedDeviceStatusSelectors.getConnectedDeviceFamily,
            );
            if (
                deviceIdentifier &&
                formatVersion &&
                formatVersion >= 2 &&
                deviceFamily === 'REP_ONE'
            ) {
                const writeData = stringToBytes('reset');
                yield apply(BleManager, BleManager.write, [
                    deviceIdentifier,
                    REP_ONE_TETHER_REP_SERVICE,
                    REP_ONE_TETHER_CALIBRATION_CHARACTERISTIC,
                    writeData,
                ]);
                toast(
                    'Your RepOne Sensor has reset its calibration for 3D readings.',
                );
            } else {
                console.tron.log(
                    `skipping reset calibration as either not connected to ${deviceIdentifier}, format version ${formatVersion} is not >= 2, or device family ${deviceFamily} is wrong`,
                );
            }
            calibrating = false;
            break; // exit the loop due to success
        } catch (err) {
            console.tron.log(
                `failed to end calibration ${err.toString()}, trying again`,
            );
        }
    }
}

function toast(msg) {
    Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
    });
}
