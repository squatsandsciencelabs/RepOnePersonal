import { take, takeEvery, select, put, call, all, apply } from 'redux-saga/effects';
import BleManager from 'react-native-ble-manager';
import moment from 'moment';

import {
    ADD_REP_DATA,
    CONNECTED_TO_DEVICE,
    DISCONNECTED,
    LOGOUT,
} from 'app/configs+constants/ActionTypes';

import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

var currentDeviceRepID = null;
var map = {};
var ignoredRepIDs = new Set();
var lastWritten = moment();
var lastReadRequest = moment();

export default function *BulkDataSaga() {
    yield all([
        takeEvery(ADD_REP_DATA, mapBulkData),
        takeEvery(DISCONNECTED, clearAll),
        takeEvery(LOGOUT, clearAll),
    ]);
};

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
        console.tron.log(`Notifying receive for ignored rep ${ignoredID}`);
        yield call(notifyBulkDataReceived, deviceIdentifier, ignoredID);
    }
    ignoredRepIDs.clear();

    // read sample count
    yield call(requestSampleCount, deviceIdentifier);
}

function *clearAll() {
    console.tron.log(`CLEARING bulk data mapping`);
    map = {};
    // note: not sure if should clear ignored rep ids
}

// EXPORTED FUNCTIONS

export function areAllSamplesReceived(deviceRepID) {
    if (!map[deviceRepID] || map[deviceRepID].totalSampleCount === null || map[deviceRepID].totalSampleCount > map[deviceRepID].receivedSampleCount) {
        return false;
    }
    return true;
}

export function notifyBulkDataReceived(deviceIdentifier, deviceRepID) {
    return new Promise(async (resolve, reject) => {
        try {
            // ignore if 5 seconds hasn't passed
            if (moment().diff(lastWritten) < 5000) {
                resolve();
                return;
            }
            lastWritten = moment();

            // generate byte array
            const data16 = new Uint16Array([deviceRepID]);
            const data8 = new Uint8Array(data16.buffer);
            const data = Array.from(data8);

            // write to sensor
            console.tron.log(`Notify bulk data received for ${deviceRepID}`);
            await BleManager.writeWithoutResponse(deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274', data);

            // resolve
            resolve();
        } catch(err) {
            console.tron.log(`Error notifying bulk data received for ${deviceRepID}`);
            reject(err);
        }
    });
}

// add bulk data, called by bluetooth.js
export async function addBulkData(deviceRepID, sampleID, time, x, y, z) {
    // clear map
    if (currentDeviceRepID !== null && currentDeviceRepID !== deviceRepID && map[currentDeviceRepID]) {
        delete map[currentDeviceRepID];
    }
    currentDeviceRepID = deviceRepID;

    if (!map[deviceRepID]) {
        // ignored
        ignoredRepIDs.add(deviceRepID);
    } else {
        // add it
        map[deviceRepID].receivedSampleCount += 1;
        map[deviceRepID].bulk[sampleID] = {
            sampleID,
            time,
            x,
            y,
            z,
        };
    }
}

export async function requestSampleCount(deviceIdentifier) {
    // device identifier check
    if (!deviceIdentifier) {
        console.tron.log(`unable to request sample count as no device identifier exists`);
        return;
    }

    // timing check
    if (moment().diff(lastReadRequest) < 5000) {
        return;
    }

    // request read check again
    lastReadRequest = moment();
    await BleManager.read(deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274');
}

export function updateBulkSampleCount(deviceRepID, totalSampleCount) {
    if (!map[deviceRepID]) {
        console.tron.log(`Cannot update bulk sample count, map does not exist for ${deviceRepID}`);
        ignoredRepIDs.add(deviceRepID);
        return;
    }

    map[deviceRepID].totalSampleCount = totalSampleCount; 
}

export function getBulkData(deviceRepID) {
    // completed check
    if(!areAllSamplesReceived(deviceRepID)) {
        return false;
    }

    // return the items
    return {
        setID: map[deviceRepID].setID,
        repIndex: map[deviceRepID].repIndex,
        bulkData: map[deviceRepID].bulk,
    };
}
