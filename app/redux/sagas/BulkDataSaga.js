import { takeEvery, select, put, call, all, spawn } from 'redux-saga/effects';
import BleManager  from 'react-native-ble-manager';

import {
    ADD_REP_DATA,
    MAP_BULK_DATA,
    ADD_BULK_DATA,
    UPDATE_BULK_SAMPLE_COUNT,
    CLEAR_BULK_DATA_MAP,
    SAVE_WORKOUT_REP,
    SAVE_HISTORY_REP,
} from 'app/configs+constants/ActionTypes';

import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as BulkDataSelectors from 'app/redux/selectors/BulkDataSelectors';

export default function *BulkDataSaga() {
    yield all([
        takeEvery(ADD_REP_DATA, updateBulkReducer),
        takeEvery(ADD_BULK_DATA, addBulkData),
        takeEvery(UPDATE_BULK_SAMPLE_COUNT, updateBulkSampleCount),
    ]);
};

function *updateBulkReducer(action) {
    if (!action.deviceRepID) {
        return;
    }
    
    const workoutData = yield select(SetsSelectors.getWorkoutSets);
    const set = workoutData[workoutData.length-1];
    const setID = set.setID;
    const repIndex = sets.reps ? set.reps.length-1 : 0;

    yield put({
        type: MAP_BULK_DATA,
        deviceRepID: action.deviceRepID,
        setID,
        repIndex,
    });
}

function *addBulkData(action) {
    const state = yield select();

    // request sample count
    const totalSampleCount = BulkDataSelectors.getTotalSampleCount(state, action.deviceRepID);
    if (totalSampleCount === null) {
        yield spawn(updateBulkSampleCount);
        return;
    }

    // completion
    const completed = BulkDataSelectors.areAllSamplesReceived(state, action.deviceRepID);
    if (completed) {
        // TODO: inform saving of the thing
        const repIndex = BulkDataSelectors.getRepIndex(state, action.deviceRepID);
        const setID = BulkDataSelectors.getSetID(state, action.deviceRepID);
        const bulkData = BulkDataSelectors.getRepBulkData(state, action.deviceRepID);
        if (SetsSelectors.getHistorySet(state, setID)) {
            // history has it
            yield put({
                type: SAVE_HISTORY_REP,
                setID,
                repIndex,
                bulkData,
            });
        } else if (SetsSelectors.getWorkoutSet(state, setID)) {
            // workout has it
            yield put({
                type: SAVE_WORKOUT_REP,
                setID,
                repIndex,
                bulkData,
            });
        }

        // clear it locally
        yield put({
            type: CLEAR_BULK_DATA_MAP,
            deviceRepID: action.deviceRepID,
        });

        // tell the sensor it's okay
        yield spawn(writeToSensor)
    }
}

function *writeToSensor() {
    const deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);
    if (!deviceIdentifier) {
        console.tron.log(`Unable to add bulk sample count as no device connected`);
        return;
    }

    yield apply(BleManager, BleManager.write, deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274');
}

function *updateBulkSampleCount(action) {
    const deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);
    if (!deviceIdentifier) {
        console.tron.log(`Unable to update bulk sample count as no device connected`);
        return;
    }

    try {
        const response = yield apply(BleManager, BleManager.read, deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274');
        const typedArray = new Uint8Array(response);
        const data16 = new Uint16Array(typedArray.buffer);
        const deviceRepID = data16[0];
        const totalSampleCount = data16[1];
        yield put({
            type: UPDATE_BULK_SAMPLE_COUNT,
            deviceRepID,
            totalSampleCount,
        });
    } catch (err) {
        console.tron.log(`Error updating bulk sample count`);
    }
}