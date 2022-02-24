import { take, takeEvery, select, put, call, all, apply, spawn } from 'redux-saga/effects';
import BleManager from 'react-native-ble-manager';
import Toast from 'react-native-root-toast';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import {
    ADD_REP_DATA,
    SAVE_WORKOUT_REP,
    SAVE_HISTORY_REP,
    DISCONNECTED_FROM_DEVICE,
    LOGOUT,
} from 'app/configs+constants/ActionTypes';

import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

var currentDeviceRepID = null;
var map = {};

export default function* BulkDataSaga() {
    if (OpenBarbellConfig.bulkEnabled) {
        yield all([
            takeEvery(ADD_REP_DATA, mapBulkData),
            takeEvery(SAVE_WORKOUT_REP, completeCheck),
            takeEvery(SAVE_HISTORY_REP, completeCheck),
            takeEvery(DISCONNECTED_FROM_DEVICE, clearAll),
            takeEvery(LOGOUT, clearAll),
        ]);
    }
};

function* mapBulkData(action) {
    if (!action.deviceRepID) {
        console.tron.log(`not updating bulk data logic as action lacks deviceRepID ${JSON.stringify(action)}`);
        return;
    }

    if (action.totalSampleCount === null) {
        console.tron.log(`not updating bulk data logic as action lacks total sample count ${JSON.stringify(action)}`);
        return;
    }

    // get vars
    const workoutData = yield select(SetsSelectors.getWorkoutSets);
    const set = workoutData[workoutData.length - 1];
    const setID = set.setID;
    const repIndex = set.reps ? set.reps.length - 1 : 0;

    // map it
    map[action.deviceRepID] = {
        setID,
        repIndex,
        totalSampleCount: action.totalSampleCount,
        receivedSampleCount: 0,
        bulk: {},
    };

    // force notify if the current is not working
    if (currentDeviceRepID !== null && !map[currentDeviceRepID]) {
        console.tron.log(`Cannot find map for ${currentDeviceRepID}, tell sensor to finish`);
        yield spawn(notifyBulkDataReceived, currentDeviceRepID);
    }
}

function* completeCheck(action) {
    // should complete check
    if (!action.bulkData) {
        return;
    }

    // get set
    const state = yield select();
    const set = SetsSelectors.getSet(state, action.setID);
    if (!set) {
        console.tron.log(`Unable to send complete message for bulk data, set not found for action ${JSON.stringify(action)}`);
        return;
    }

    // get rep
    const rep = set.reps[action.repIndex];
    if (!rep) {
        console.tron.log(`Unable to send complete message for bulk data, rep not found for action ${JSON.stringify(action)}`);
        return;
    }

    // get device rep id
    if (!rep.deviceRepID) {
        console.tron.log(`Unable to send complete message for bulk data, deviceRepID not found for rep ${JSON.stringify(rep)} action ${JSON.stringify(action)}`);
        return;
    }

    // force notify completion
    yield spawn(notifyBulkDataReceived, rep.deviceRepID, true);
}

function* clearAll(action) {
    console.tron.log(`CLEARING bulk data mapping`);
    map = {};
    currentDeviceRepID = null;
}

// note, spawn this thing
function* notifyBulkDataReceived(deviceRepID, completed = false) {
    // generate byte array
    const data16 = new Uint16Array([deviceRepID]);
    const data8 = new Uint8Array(data16.buffer);
    const data = Array.from(data8);

    while (true) {
        // fail out upon disconnect 
        let deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);
        if (!deviceIdentifier) {
            console.tron.log(`not connected, ignoring notifying bulk data received`);
            return;
        }

        try {
            // write to sensor
            console.tron.log(`Attempt notify bulk data received for ${deviceRepID}`);
            yield apply(BleManager, BleManager.write, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274', data]);
            console.tron.log(`Succeeded notify bulk data received for ${deviceRepID}`);

            // success, bail
            const msg = completed ? `Bulk Data Received For ${deviceRepID}` : `Ignored bulk data for ${deviceRepID}`;
            Toast.show(msg, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
            return;
        } catch (err) {
            console.tron.log(`Error notifying bulk data received for ${deviceRepID} ${err.toString()}`);
        }
    }
}

// EXPORTED FUNCTIONS

export async function addBulkData(raw, deviceRepID, sampleID, time, x, y, z) {
    // clear map
    if (currentDeviceRepID !== null && currentDeviceRepID !== deviceRepID && map[currentDeviceRepID]) {
        console.tron.log(`clearing map for ${currentDeviceRepID} and switching to ${deviceRepID}`);
        delete map[currentDeviceRepID];
    }
    currentDeviceRepID = deviceRepID;

    // add if able
    if (map[deviceRepID] && !map[deviceRepID].bulk[sampleID]) {
        // add
        map[deviceRepID].bulk[sampleID] = {
            raw: raw.toString(),
            sampleID,
            time,
            x,
            y,
            z,
        };

        // increment
        map[deviceRepID].receivedSampleCount += 1;

        // debug logging
        console.tron.log(`rep:${deviceRepID} ${raw} values are sample_id:${sampleID} time:${time} x:${x} y:${y} z:${z} having received ${map[deviceRepID].receivedSampleCount} of ${map[deviceRepID].totalSampleCount}`);
    }
}

export function getBulkData(deviceRepID) {
    // map exists
    if (!map[deviceRepID]) {
        return false;
    }

    // return true is already done
    // this is pretty hacky, but just trying to make it work right now
    if (map[deviceRepID].completed === true) {
        return true;
    }

    // completed check
    if (map[deviceRepID].receivedSampleCount < map[deviceRepID].totalSampleCount) {
        return false;
    }

    // flag complete
    map[deviceRepID].completed = true;

    // return the items
    return {
        setID: map[deviceRepID].setID,
        repIndex: map[deviceRepID].repIndex,
        bulkData: map[deviceRepID].bulk,
    };
}
