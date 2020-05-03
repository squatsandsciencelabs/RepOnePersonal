import { take, takeEvery, select, put, call, all, apply } from 'redux-saga/effects';
import BleManager from 'react-native-ble-manager';
import Toast from 'react-native-root-toast';
import { stringToBytes } from 'convert-string';

import {
    START_CALIBRATION,
    FINISH_CALIBRATION,
    CANCEL_CALIBRATION,
    DISCONNECTED_FROM_DEVICE,
} from 'app/configs+constants/ActionTypes';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as CalibrationSelectors from 'app/redux/selectors/CalibrationSelectors';

var calibrating = false;

export default function *CalibrationSaga() {
    yield all([
        takeEvery(START_CALIBRATION, startCalibration),
        takeEvery(FINISH_CALIBRATION, finishCalibration),
        takeEvery(DISCONNECTED_FROM_DEVICE, forceEndCalibration),
        // note: shoulnd't need cancel calibration as cancel is disabled once you tap start
    ]);
};

function *startCalibration(action) {
    calibrating = false;
    while (true) {
        try {
            const deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);
            const formatVersion = yield select(ConnectedDeviceStatusSelectors.getAPIFormatVersion);
            if (formatVersion && formatVersion >= 2) {
                const writeData = stringToBytes('startcal');
                yield apply(BleManager, BleManager.write, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20281', writeData]);
            } else {
                console.tron.log(`skipping start calibration as format version ${formatVersion} is not >= 2`);
            }
            calibrating = true;
            break; // exit the loop due tosuccess
        } catch (err) {
            console.tron.log(`failed to start calibration ${err.toString()}, trying again`);
        }
    }
}

function *finishCalibration(action) {
    while (true) {
        try {
            const deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);
            const formatVersion = yield select(ConnectedDeviceStatusSelectors.getAPIFormatVersion);
            if (formatVersion && formatVersion >= 2) {
                const writeData = stringToBytes('endcal');
                yield apply(BleManager, BleManager.write, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20281', writeData]);
            } else {
                console.tron.log(`skipping finish calibration as format version ${formatVersion} is not >= 2`);
            }
            calibrating = false;
            toast('Your RepOne device is now calibrated for accurate 3D readings.');
            break; // exit the loop due tosuccess
        } catch (err) {
            console.tron.log(`failed to end calibration ${err.toString()}, trying again`);
        }
    }
}

function *forceEndCalibration(action) {
    const isModalShowing = yield select(CalibrationSelectors.getIsModalShowing);
    if (!isModalShowing) {
        return;
    }

    calibrating = false;
    toast("You disconnected from your sensor, please reconnect and try calibrating again");
    yield put({ type: CANCEL_CALIBRATION });
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
