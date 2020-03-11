import { take, takeEvery, select, put, call, all, apply } from 'redux-saga/effects';
import BleManager  from 'react-native-ble-manager';

import {
    ADD_REP_DATA,
    CONNECTED_TO_DEVICE,
    LOGOUT,
} from 'app/configs+constants/ActionTypes';

import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

var map = {};
var ignoredRepIDs = new Set();

export default function *BulkDataSaga() {
    yield all([
        takeEvery(ADD_REP_DATA, mapBulkData),
        takeEvery(LOGOUT, clearAll),
    ]);
};

// convenience functions

function areAllSamplesReceived(deviceRepID) {
    if (!map[deviceRepID] || map[deviceRepID].totalSampleCount === null || map[deviceRepID].totalSampleCount > map[deviceRepID].receivedSampleCount) {
        return false;
    }
    return true;
}

// map saga function

function *mapBulkData(action) {
    if (!action.deviceRepID) {
        console.tron.log(`not updating reducing because action lacks deviceRepID ${JSON.stringify(action)}`);
        return;
    }

    // get vars
    const workoutData = yield select(SetsSelectors.getWorkoutSets);
    const set = workoutData[workoutData.length-1];
    const setID = set.setID;
    const repIndex = set.reps ? set.reps.length-1 : 0;

    // map it
    map[action.deviceRepID] = {
        setID,
        repIndex,
        totalSampleCount: null,
        receivedSampleCount: 0,
        bulk: {},
    };

    // bluetooth attempt
    let deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);
    if (!deviceIdentifier) {
        console.tron.log(`Unable to update bulk sample count as no device connected, trying again once connected to a device`);
        yield take(CONNECTED_TO_DEVICE);
        deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);
    }

    // finish ignored
    for (let ignoredID of ignoredRepIDs) {
        const data16 = new Uint16Array([ignoredID]);
        const data8 = new Uint8Array(data16.buffer);
        const data = Array.from(data8);
        console.tron.log(`Finishing ignored rep ${ignoredID}`);
        yield apply(BleManager, BleManager.writeWithoutResponse, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274', data]);
    }
    ignoredRepIDs.clear();

    // read sample count
    yield apply(BleManager, BleManager.read, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274']);
}

// clear
function *clearAll() {
    map = {};
}

// add bulk data, called by bluetooth.js
// should return true or false
export function addBulkData(deviceRepID, sampleID, time, x, y, z) {
    // valid check
    if (!map[deviceRepID]) {
        ignoredRepIDs.add(deviceRepID);
        return false;
    }

    // add it
    map[deviceRepID].receivedSampleCount += 1;
    map[deviceRepID].bulk[sampleID] = {
        sampleID,
        time,
        x,
        y,
        z,
    };

    // completed check
    if(!areAllSamplesReceived(deviceRepID)) {
        return false;
    }

    // get the values
    const result = {
        setID: map[deviceRepID].setID,
        repIndex: map[deviceRepID].repIndex,
        bulkData: map[deviceRepID].bulk,
    };

    // clear it locally
    delete map[deviceRepID];

    // return the items
    return result;
}

export function updateBulkSampleCount(deviceRepID, totalSampleCount) {
    map[deviceRepID].totalSampleCount = totalSampleCount; 
}
