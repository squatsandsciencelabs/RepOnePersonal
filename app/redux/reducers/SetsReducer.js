import {
    SAVE_DEFAULT_METRIC,
    SAVE_WORKOUT_SET,
    SAVE_WORKOUT_SET_TAGS,
    SAVE_HISTORY_SET,
    SAVE_HISTORY_SET_TAGS,
    ADD_REP_DATA,
    SAVE_WORKOUT_REP,
    SAVE_HISTORY_REP,
    END_SET,
    SAVE_WORKOUT_VIDEO,
    SAVE_HISTORY_VIDEO,
    DELETE_WORKOUT_VIDEO,
    DELETE_HISTORY_VIDEO,
    LOAD_PERSISTED_SET_DATA,
    END_WORKOUT,
    BEGIN_UPLOADING_SETS,
    FAILED_UPLOAD_SETS,
    UPDATE_SET_DATA_FROM_SERVER,
    FINISH_UPLOADING_SETS,
    LOGIN_SUCCESS,
    LOGOUT,
    DELETE_WORKOUT_SET,
    RESTORE_WORKOUT_SET,
    DELETE_HISTORY_SET,
    RESTORE_HISTORY_SET,
    TEST_1RM,
    ADD_3D_POSITIONS_TO_REP,
    CONNECTED_TO_DEVICE,
    DISCONNECTED_FROM_DEVICE,
    ADD_KRATOS_REP_DATA,
    SET_DEVICE_TYPE,
    SAVE_WORKOUT_SET_KRATOS_DISCS,
    SAVE_HISTORY_SET_KRATOS_DISCS,
} from 'app/configs+constants/ActionTypes';
import 'react-native-get-random-values';
import { v4 as uuidV4 } from 'uuid';
import { getVersion } from 'react-native-device-info';
import { Platform } from 'react-native';
import * as SetUtils from 'app/utility/SetUtils';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';
import { getDeviceType } from 'app/utility/SensorUtils';

const initKratosDiscs = {
    XS: null,
    S: null,
    M: null,
    L: null,
    XL: null,
};

const SetsReducer = (state = createDefaultState(), action) => {
    switch (action.type) {
        case SAVE_DEFAULT_METRIC:
            return saveDefaultMetric(state, action);
        case SAVE_WORKOUT_SET:
            return saveWorkoutSet(state, action);
        case DELETE_WORKOUT_SET:
            return deleteWorkoutSet(state, action);
        case DELETE_HISTORY_SET:
            return deleteHistorySet(state, action);
        case RESTORE_WORKOUT_SET:
            return restoreWorkoutSet(state, action);
        case RESTORE_HISTORY_SET:
            return restoreHistorySet(state, action);
        case SAVE_WORKOUT_SET_TAGS:
            return saveWorkoutSetTags(state, action);
        case SAVE_HISTORY_SET:
            return saveHistorySet(state, action);
        case SAVE_HISTORY_SET_TAGS:
            return saveHistorySetTags(state, action);
        case SAVE_HISTORY_SET_KRATOS_DISCS:
            return saveHistorySetKratosDiscs(state, action);
        case ADD_REP_DATA:
            return addRepData(state, action);
        case ADD_KRATOS_REP_DATA:
            return addKratosRepData(state, action);
        case SAVE_WORKOUT_REP:
            return saveWorkoutRep(state, action);
        case SAVE_HISTORY_REP:
            return saveHistoryRep(state, action);
        case END_SET:
            return endSet(state, action);
        case SAVE_WORKOUT_VIDEO:
            return saveWorkoutVideo(state, action);
        case SAVE_HISTORY_VIDEO:
            return saveHistoryVideo(state, action);
        case SAVE_WORKOUT_SET_KRATOS_DISCS:
            return saveWorkoutSetKratosDiscs(state, action);
        case DELETE_WORKOUT_VIDEO:
            return deleteWorkoutVideo(state, action);
        case DELETE_HISTORY_VIDEO:
            return deleteHistoryVideo(state, action);
        case LOAD_PERSISTED_SET_DATA:
            return loadPersistedSetData(state, action);
        // NOTE: it feels weird to have end workout here, but ending a workout affects the SETS not the workout itself, so the set reducer needs to handle it
        case END_WORKOUT:
            return endWorkout(state, action);
        case BEGIN_UPLOADING_SETS:
            return beginUploadingSets(state, action);
        case FAILED_UPLOAD_SETS:
            return failedUploadSets(state, action);
        case UPDATE_SET_DATA_FROM_SERVER:
            return updateSetDataFromServer(state, action);
        case LOGIN_SUCCESS:
            return loginSuccess(state, action);
        case LOGOUT:
            return clearHistory(state, action);
        case FINISH_UPLOADING_SETS:
            return finishUploadingSets(state, action);
        case TEST_1RM:
            return overrideWithTestData(state, action);
        case ADD_3D_POSITIONS_TO_REP:
            return add3DPositionsToRep(state, action);
        case CONNECTED_TO_DEVICE:
        case DISCONNECTED_FROM_DEVICE:
            return connectedDisconnectedDevice(state, action);
        case SET_DEVICE_TYPE:
            return setDeviceType(state, action);
        default:
            return state;
    }
};

const connectedDisconnectedDevice = (state, action) => {
    const workoutData = state.workoutData;
    const set = workoutData[workoutData.length - 1];

    if (set.reps.length > 0) {
        let deviceType = 'RepOne';

        if (action.deviceName) {
            deviceType = getKratosEnabled()
                ? getDeviceType(action.deviceName)
                : 'RepOne';
        }

        return { ...state, deviceType };
    } else {
        return setDeviceType(state, action);
    }
};

const setDeviceType = (state, action) => {
    const workoutData = state.workoutData;
    const set = workoutData[workoutData.length - 1];

    let deviceType = 'RepOne';
    if (action.deviceName) {
        deviceType = getKratosEnabled()
            ? getDeviceType(action.deviceName)
            : 'RepOne';
    }

    let kratosDiscs = null;

    if (deviceType === 'Kratos') {
        kratosDiscs = initKratosDiscs;
    }

    const newSet = { ...set, deviceType, kratosDiscs };

    const newWorkoutData = [
        ...workoutData.slice(0, workoutData.length - 1), // copy all but the last element
        newSet,
    ];

    return {
        ...state,
        deviceType,
        workoutData: newWorkoutData,
    };
};

const createSet = (
    setNumber = 1,
    metric = 'kgs',
    deviceType = 'RepOne',
    kratosDiscs = null,
) => ({
    exercise: null,
    setNumber: setNumber,
    setID: uuidV4(),
    workoutID: null, // to be set on ending workout
    weight: null,
    metric: metric,
    rpe: null,
    initialStartTime: null, // time of first edit, used to calculate times for sets with no reps
    // startTime: null, // LEGACY - use rep time instead
    // endTime: null, // LEGACY - use rep time instead
    // removed: false, // LEGACY - use deleted instead, and removed / if the entire set is empty if deleted doesn't exist
    deleted: false,
    reps: [],
    tags: [],
    videoFileURL: null,
    videoType: null,
    deviceType: deviceType,
    kratosDiscs: kratosDiscs,
});

const createDefaultState = () => {
    let set = createSet();
    let setID = set.setID;

    return {
        workoutData: [set],
        historyData: {},
        setIDsToUpload: [],
        setIDsBeingUploaded: [],
        revision: 0,
        deviceType: 'RepOne',
    };
};

// Set default metric

const saveDefaultMetric = (state, action) => {
    let newWorkoutData = state.workoutData.slice(0);

    // update the working set's metric
    if (newWorkoutData.length > 0) {
        let setIndex = newWorkoutData.length - 1;
        let latestSet = newWorkoutData[setIndex];
        let changes = {};

        // Check if set is empty before allowing metric to change
        if (SetUtils.isUntouched(latestSet)) {
            changes.metric = action.defaultMetric;
        }

        newWorkoutData[setIndex] = Object.assign({}, latestSet, changes);
    }
    return Object.assign({}, state, {
        workoutData: newWorkoutData
    });
};

// SAVE_WORKOUT_SET

// NOTE - using one slice to copy, then altering, as the spread operator + slice was buggy and deletes rows
const saveWorkoutSet = (state, action) => {
    let newWorkoutData = state.workoutData.slice(0);
    let setIndex = newWorkoutData.findIndex(set => set.setID === action.setID);
    let set = newWorkoutData[setIndex];

    let changes = {};
    if ('exercise' in action) {
        changes.exercise = action.exercise.toLowerCase();
    }
    if ('weight' in action) {
        changes.weight = action.weight;
    }
    if ('metric' in action) {
        changes.metric = action.metric;
    }
    if ('rpe' in action) {
        changes.rpe = action.rpe;
    }
    if (!set.initialStartTime) {
        changes.initialStartTime = new Date();
    }
    const newSet = {
        ...set,
        ...changes,
    };

    // update rep computed properties
    if ('weight' in action || 'metric' in action) {
        // load changed, update computed properties
        newSet.reps = newSet.reps.map(r => {
            if (OpenBarbellConfig.bulkMetricsEnabled && SetUtils.getCanProcessForceOrMetric(newSet, r)) {
                // can process
                const rep = { ...r };
                const data = SetUtils.getBulkArray(rep);
                const deltaTs = SetUtils.getDeltaTimes(rep, data);
                const velocities = SetUtils.getVelocities(rep, deltaTs, data);
                const accelerations = SetUtils.getAccelerations(rep, velocities, deltaTs);
                const forces = SetUtils.getForces(newSet, rep, accelerations, velocities);
                const powers = SetUtils.getPowers(newSet, rep, forces, velocities);

                rep.peakVelocityIndex = SetUtils.getPeakVelocityIndex(rep, velocities);
                rep.peakAccelerationIndex = SetUtils.getPeakAccelerationIndex(rep, accelerations);
                rep.peakAcceleration = accelerations[rep.peakAccelerationIndex];
                rep.peakForceIndex = SetUtils.getPeakForceIndex(newSet, rep, forces);
                rep.peakForce = forces[rep.peakForceIndex];
                rep.peakForceHeight = SetUtils.getPeakHeight(data, rep.peakForceIndex);
                rep.averageForce = SetUtils.getAverageForce(newSet, rep, forces);
                rep.peakPowerIndex = SetUtils.getPeakPowerIndex(newSet, rep, powers);
                rep.peakPower = powers[rep.peakPowerIndex];
                rep.peakPowerHeight = SetUtils.getPeakHeight(data, rep.peakPowerIndex);
                rep.averagePower = SetUtils.getAveragePower(newSet, rep, powers);

                return rep;
            } else {
                // cannot process
                if (OpenBarbellConfig.bulkMetricsEnabled && SetUtils.getRepHasBulkComputedProperties(r)) {
                    // need to reset
                    return {
                        ...r,
                        peakVelocityIndex: null,
                        peakAccelerationIndex: null,
                        peakAcceleration: null,
                        peakForceIndex: null,
                        peakForce: null,
                        peakForceHeight: null,
                        averageForce: null,
                        peakPowerIndex: null,
                        peakPower: null,
                        peakPowerHeight: null,
                        averagePower: null,
                    };
                } else {
                    // return original
                    return r;
                }
            }
        });
    }

    newWorkoutData[setIndex] = newSet;

    return {
        ...state,
        workoutData: newWorkoutData,
    };
};

// DELETE_WORKOUT_SET

const deleteWorkoutSet = (state, action) => {
    // copy workout data
    let newWorkoutData = state.workoutData.slice(0);

    // get set
    let setIndex = newWorkoutData.findIndex(set => set.setID === action.setID);
    newWorkoutData[setIndex].deleted = true;

    return {
        ...state,
        workoutData: newWorkoutData,
    };
};

// RESTORE_WORKOUT_SET

const restoreWorkoutSet = (state, action) => {
    // copy workout data
    let newWorkoutData = state.workoutData.slice(0);

    // get set
    let setIndex = newWorkoutData.findIndex(set => set.setID === action.setID);
    newWorkoutData[setIndex].deleted = false;

    return {
        ...state,
        workoutData: newWorkoutData,
    };
};

// SAVE_WORKOUT_SET_TAGS

const saveWorkoutSetTags = (state, action) => {
    let newWorkoutData = state.workoutData.slice(0);
    let setIndex = newWorkoutData.findIndex(set => set.setID === action.setID);
    let set = newWorkoutData[setIndex];
    let tags = action.hasOwnProperty('tags') && action.tags ? action.tags.map((tag) => tag.toLowerCase()) : [];

    let changes = {
        tags: [...tags]
    };
    if (!set.initialStartTime) {
        changes.initialStartTime = new Date();
    }
    newWorkoutData[setIndex] = Object.assign({}, set, changes);

    return Object.assign({}, state, {
        workoutData: newWorkoutData
    });
};

// SAVE_WORKOUT_SET_KRATOS_DISCS

const saveWorkoutSetKratosDiscs = (state, action) => {
    const newWorkoutData = state.workoutData.slice(0);
    const setIndex = newWorkoutData.findIndex(
        set => set.setID === action.setID,
    );
    const set = newWorkoutData[setIndex];

    const kratosDiscs = action.kratosDiscs.reduce(
        (obj, item) => Object.assign(obj, item),
        {},
    );

    const changes = {
        kratosDiscs,
    };

    if (!set.initialStartTime) {
        changes.initialStartTime = new Date();
    }
    newWorkoutData[setIndex] = Object.assign({}, set, changes);

    return {
        ...state,
        workoutData: newWorkoutData,
    };
};

// SAVE_HISTORY_SET

const saveHistorySet = (state, action) => {
    let setID = action.setID;
    let historyData = state.historyData;
    let set = historyData[setID];

    // new set
    let setChanges = {};
    if ('exercise' in action) {
        setChanges.exercise = action.exercise.toLowerCase();
    }
    if ('weight' in action) {
        setChanges.weight = action.weight;
    }
    if ('metric' in action) {
        setChanges.metric = action.metric;
    }
    if ('rpe' in action) {
        setChanges.rpe = action.rpe;
    }
    const newSet = {
        ...set,
        ...setChanges,
    };

    // update rep computed properties
    if ('weight' in action || 'metric' in action) {
        // load changed, update computed properties
        newSet.reps = newSet.reps.map(r => {
            if (OpenBarbellConfig.bulkMetricsEnabled && SetUtils.getCanProcessForceOrMetric(newSet, r)) {
                // can process
                const rep = { ...r };
                const data = SetUtils.getBulkArray(rep);
                const deltaTs = SetUtils.getDeltaTimes(rep, data);
                const velocities = SetUtils.getVelocities(rep, deltaTs, data);
                const accelerations = SetUtils.getAccelerations(rep, velocities, deltaTs);
                const forces = SetUtils.getForces(newSet, rep, accelerations, velocities);
                const powers = SetUtils.getPowers(newSet, rep, forces, velocities);

                rep.peakVelocityIndex = SetUtils.getPeakVelocityIndex(rep, velocities);
                rep.peakAccelerationIndex = SetUtils.getPeakAccelerationIndex(rep, accelerations);
                rep.peakAcceleration = accelerations[rep.peakAccelerationIndex];
                rep.peakForceIndex = SetUtils.getPeakForceIndex(newSet, rep, forces);
                rep.peakForce = forces[rep.peakForceIndex];
                rep.peakForceHeight = SetUtils.getPeakHeight(data, rep.peakForceIndex);
                rep.averageForce = SetUtils.getAverageForce(newSet, rep, forces);
                rep.peakPowerIndex = SetUtils.getPeakPowerIndex(newSet, rep, powers);
                rep.peakPower = powers[rep.peakPowerIndex];
                rep.peakPowerHeight = SetUtils.getPeakHeight(data, rep.peakPowerIndex);
                rep.averagePower = SetUtils.getAveragePower(newSet, rep, powers);

                return rep;
            } else {
                // cannot process
                if (OpenBarbellConfig.bulkMetricsEnabled && SetUtils.getRepHasBulkComputedProperties(r)) {
                    // need to reset
                    return {
                        ...r,
                        peakVelocityIndex: null,
                        peakAccelerationIndex: null,
                        peakAcceleration: null,
                        peakForceIndex: null,
                        peakForce: null,
                        peakForceHeight: null,
                        averageForce: null,
                        peakPowerIndex: null,
                        peakPower: null,
                        peakPowerHeight: null,
                        averagePower: null,
                    };
                } else {
                    // return original
                    return r;
                }
            }
        });
    }

    // state changes
    const stateChanges = {
        historyData: {
            ...historyData,
            [setID]: newSet,
        }
    };
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return {
        ...state,
        ...stateChanges,
    };
};

// DELETE_HISTORY_SET

const deleteHistorySet = (state, action) => {
    const setID = action.setID;
    let stateChanges = {};

    // update the set
    let newHistoryData = { ...state.historyData };
    newHistoryData[setID].deleted = true;
    stateChanges.historyData = newHistoryData;

    // sync
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return Object.assign({}, state, stateChanges);
};

// RESTORE_HISTORY_SET

const restoreHistorySet = (state, action) => {
    const setID = action.setID;
    let stateChanges = {};

    // update the set
    let newHistoryData = { ...state.historyData };
    newHistoryData[setID].deleted = false;
    stateChanges.historyData = newHistoryData;

    // sync
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return Object.assign({}, state, stateChanges);
};

// SAVE_HISTORY_SET_TAGS

const saveHistorySetTags = (state, action) => {
    let setID = action.setID;
    let historyData = state.historyData;
    let set = historyData[setID];
    let tags = action.hasOwnProperty('tags') && action.tags ? action.tags.map((tag) => tag.toLowerCase()) : [];

    // new set
    let setChanges = {
        tags: [...tags]
    };
    let newSet = Object.assign({}, set, setChanges);

    // state changes
    let stateChanges = {};
    stateChanges.historyData = Object.assign({}, historyData, {
        [setID]: newSet
    });
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return Object.assign({}, state, stateChanges);
};

// SAVE_HISTORY_SET_KRATOS_DISCS

const saveHistorySetKratosDiscs = (state, action) => {
    let setID = action.setID;
    let historyData = state.historyData;
    let set = historyData[setID];

    // new set

    const kratosDiscs = action.kratosDiscs.reduce(
        (obj, item) => Object.assign(obj, item),
        {},
    );
    // new set
    const changes = {
        kratosDiscs,
    };

    let newSet = Object.assign({}, set, changes);

    // state changes
    let stateChanges = {};
    stateChanges.historyData = Object.assign({}, historyData, {
        [setID]: newSet
    });
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return {
        ...state,
        ...stateChanges
    };
}

// ADD_REP_DATA

const addRepData = (state, action) => {
    let workoutData = state.workoutData;
    let set = workoutData[workoutData.length - 1];

    const deviceFamily = 'RepOne';

    let rep = {
        isValid: action.isValid,
        removed: false,
        hardware: Platform.OS,
        appVersion: getVersion(), // TODO: also firmware version
        deviceName: action.deviceName,
        deviceIdentifier: action.deviceIdentifier,
        time: action.time,
        deviceRepID: action.deviceRepID,
        firmwareVersion: action.firmwareVersion,
        repNumber: action.repNumber,
        averageVelocity: action.averageVelocity,
        rom: action.rom,
        peakVelocity: action.peakVelocity,
        peakHeight: action.peakHeight,
        duration: action.duration,
        deviceFamily,
    };

    if (OpenBarbellConfig.bulkMetricsEnabled) {
        rep.linear3DAverageVelocity = action.linear3DAverageVelocity;
        rep.linear3DROM = action.linear3DROM;
        rep.peakVelocityIndex = null;
        rep.peakAcceleration = null;
        rep.peakAccelerationIndex = null;
        rep.peakForce = null;
        rep.peakForceIndex = null;
        rep.peakForceHeight = null;
        rep.averageForce = null;
        rep.peakPower = null;
        rep.peakPowerIndex = null;
        rep.peakPowerHeight = null;
        rep.averagePower = null;
    }

    let setChanges = {
        reps: [...set.reps, rep],
        deleted: false
    };

    if (!set.initialStartTime) {
        setChanges.initialStartTime = new Date();
    }

    let newSet = Object.assign({}, set, setChanges);
    let newWorkoutData = [
        ...workoutData.slice(0, workoutData.length - 1), // copy all but the last element
        newSet
    ];

    return Object.assign({}, state, {
        workoutData: newWorkoutData
    });
};


const addKratosRepData = (state, action) => {
    let workoutData = state.workoutData;
    let set = workoutData[workoutData.length - 1];

    const deviceFamily = 'Kratos';

    const previousRepsAreRemoved = set.reps.every(rep=>!!rep.removed);

    const removed = previousRepsAreRemoved ? set.reps.length < action.kratosAutoDeleteReps : false;

    const rep = {
        isValid: action.isValid,
        repId: action.repId,
        repNumber: action.repNumber,
        cRom: action.cRom,
        cAvgLinearVelocity: action.cAvgLinearVelocity,
        cPeakLinearVelocity: action.cPeakLinearVelocity,
        cPeakVelocityLocation: action.cPeakVelocityLocation,
        cDuration: action.cDuration,
        cMeanAcceleration: action.cMeanAcceleration,
        cPeakLinearAcceleration: action.cPeakLinearAcceleration,
        cPeakPower: action.cPeakPower,
        eRom: action.eRom,
        eAvgLinearVelocity: action.eAvgLinearVelocity,
        ePeakLinearVelocity: action.ePeakLinearVelocity,
        ePeakVelocityLocation: action.ePeakVelocityLocation,
        eDuration: action.eDuration,
        eMeanAcceleration: action.eMeanAcceleration,
        ePeakLinearAcceleration: action.ePeakLinearAcceleration,
        ePeakPower: action.ePeakPower,
        deviceFamily,
        removed,
        time: action.time,
    };

    let setChanges = {
        reps: [...set.reps, rep],
        deleted: false
    };

    if (!set.initialStartTime) {
        setChanges.initialStartTime = new Date();
    }

    let newSet = Object.assign({}, set, setChanges);
    let newWorkoutData = [
        ...workoutData.slice(0, workoutData.length - 1), // copy all but the last element
        newSet
    ];

    return Object.assign({}, state, {
        workoutData: newWorkoutData
    });
};

// SAVE_WORKOUT_REP

const saveWorkoutRep = (state, action) => {
    // copy workout data
    let newWorkoutData = state.workoutData.slice(0);

    // get set
    let setIndex = newWorkoutData.findIndex(set => set.setID === action.setID);
    if (setIndex === -1) {
        return state;
    }

    let set = newWorkoutData[setIndex];
    var setID = set.setID;

    // update set and its rep
    newWorkoutData[setIndex] = setWithUpdatedRep(set, action.repIndex, action.removed, action.bulkData);

    // state
    let stateChanges = {
        workoutData: newWorkoutData
    };

    return Object.assign({}, state, stateChanges);
};

// SAVE_HISTORY_REP

const saveHistoryRep = (state, action) => {
    // define vars
    let setID = action.setID;
    let historyData = state.historyData;
    let newSet = setWithUpdatedRep(historyData[setID], action.repIndex, action.removed, action.bulkData);

    // history
    let historyChanges = {};
    historyChanges[setID] = newSet;
    let newHistoryData = Object.assign({}, state.historyData, historyChanges);

    // state
    let stateChanges = {
        historyData: newHistoryData
    };
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return Object.assign({}, state, stateChanges);
};

// Update rep helper function

const setWithUpdatedRep = (set, repIndex, removed, bulkData) => {
    // rep
    let rep = set.reps[repIndex];
    let newRep = { ...rep };

    // update removed
    if (removed !== undefined && removed !== null) {
        newRep.removed = removed;
    }

    // update bulk and computed properties
    if (OpenBarbellConfig.bulkEnabled && OpenBarbellConfig.bulkMetricsEnabled && bulkData !== undefined && bulkData !== null) {
        newRep.bulkData = { ...bulkData };

        // update computed properties
        if (!newRep.isValid || !SetUtils.getCanProcessForceOrMetric(set, newRep)) {
            // cannot process, null
            newRep.peakVelocityIndex = null;
            newRep.peakAccelerationIndex = null;
            newRep.peakAcceleration = null;
            newRep.peakForceIndex = null;
            newRep.peakForce = null;
            newRep.peakForceHeight = null;
            newRep.averageForce = null;
            newRep.peakPowerIndex = null;
            newRep.peakPower = null;
            newRep.peakPowerHeight = null;
            newRep.averagePower = null;
        } else {
            // can process, update it
            const data = SetUtils.getBulkArray(newRep);
            const deltaTs = SetUtils.getDeltaTimes(newRep, data);
            const velocities = SetUtils.getVelocities(newRep, deltaTs, data);
            const accelerations = SetUtils.getAccelerations(newRep, velocities, deltaTs);
            const forces = SetUtils.getForces(set, newRep, accelerations, velocities);
            const powers = SetUtils.getPowers(set, newRep, forces, velocities);

            newRep.peakVelocityIndex = SetUtils.getPeakVelocityIndex(newRep, velocities);
            newRep.peakAccelerationIndex = SetUtils.getPeakAccelerationIndex(newRep, accelerations);
            newRep.peakAcceleration = accelerations[newRep.peakAccelerationIndex];
            newRep.peakForceIndex = SetUtils.getPeakForceIndex(set, newRep, forces);
            newRep.peakForce = forces[newRep.peakForceIndex];
            newRep.peakForceHeight = SetUtils.getPeakHeight(data, newRep.peakForceIndex);
            newRep.averageForce = SetUtils.getAverageForce(set, newRep, forces);
            newRep.peakPowerIndex = SetUtils.getPeakPowerIndex(set, newRep, powers);
            newRep.peakPower = powers[newRep.peakPowerIndex];
            newRep.peakPowerHeight = SetUtils.getPeakHeight(data, newRep.peakPowerIndex);
            newRep.averagePower = SetUtils.getAveragePower(set, newRep, powers);
        }
    }

    // reps
    let newReps = [
        ...set.reps.slice(0, repIndex),
        newRep,
        ...set.reps.slice(repIndex + 1)
    ];

    // set 0 reps = removed check
    let activeRep = newReps.find((rep) => { return !rep.removed; });
    let setWasDeleted = activeRep === undefined;

    // set
    return {
        ...set,
        reps: newReps,
        deleted: setWasDeleted,
    };
};

// END_SET

const endSet = (state, action) => {
    let workoutData = state.workoutData;
    let currentSet = workoutData[workoutData.length - 1];
    let newWorkoutData = [
        ...workoutData,
        createSet(
            currentSet.setNumber + 1,
            action.defaultMetric,
            state.deviceType,
        ),
    ];

    return Object.assign({}, state, {
        workoutData: newWorkoutData
    });
};

// SAVE_WORKOUT_VIDEO

const saveWorkoutVideo = (state, action) => {
    let newWorkoutData = state.workoutData.slice(0);
    let setIndex = newWorkoutData.findIndex(set => set.setID === action.setID);
    let set = newWorkoutData[setIndex];

    let setChanges = {
        videoFileURL: action.videoFileURL,
        videoType: action.videoType
    };
    if (!set.initialStartTime) {
        setChanges.initialStartTime = new Date();
    }
    newWorkoutData[setIndex] = Object.assign({}, set, setChanges);

    return Object.assign({}, state, {
        workoutData: newWorkoutData
    });
};

// SAVE_HISTORY_VIDEO

const saveHistoryVideo = (state, action) => {
    let setID = action.setID;
    let historyData = state.historyData;
    let set = historyData[setID];

    let newSet = Object.assign({}, set, {
        videoFileURL: action.videoFileURL,
        videoType: action.videoType
    });

    // state changes
    let stateChanges = {};
    stateChanges.historyData = Object.assign({}, historyData, {
        [setID]: newSet
    });
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return Object.assign({}, state, stateChanges);
};

// DELETE_WORKOUT_VIDEO

const deleteWorkoutVideo = (state, action) => {

    let newWorkoutData = state.workoutData.slice(0);
    let setIndex = newWorkoutData.findIndex(set => set.setID === action.setID);
    let set = newWorkoutData[setIndex];

    newWorkoutData[setIndex] = Object.assign({}, set, {
        videoFileURL: null,
        videoType: null
    });
    return Object.assign({}, state, {
        workoutData: newWorkoutData
    });
}

// DELETE_HISTORY_VIDEO

const deleteHistoryVideo = (state, action) => {
    let setID = action.setID;
    let historyData = state.historyData;
    let set = historyData[setID];

    let newSet = Object.assign({}, set, {
        videoFileURL: null,
        videoType: null
    });

    // state changes
    let stateChanges = {};
    stateChanges.historyData = Object.assign({}, historyData, {
        [setID]: newSet
    });
    if (!state.setIDsToUpload.includes(setID)) {
        stateChanges.setIDsToUpload = [...state.setIDsToUpload, setID];
    }

    return Object.assign({}, state, stateChanges);
}

// LOAD_PERSISTED_SET_DATA

const loadPersistedSetData = (state, action) => {
    return action.sets;
};

// END_WORKOUT

const endWorkout = (state, action) => {
    let workoutSetIDs = [];
    let historyChanges = {};
    let workoutID = uuidV4();
    let workoutData = state.workoutData;
    let length = workoutData.length;

    // add all sets except the working set
    for (let i = 0; i < length - 1; i++) {
        let set = workoutData[i];
        let setID = set.setID;
        set.workoutID = workoutID;
        workoutSetIDs.push(setID);
        historyChanges[setID] = set;
    }

    // add working set
    let lastSet = workoutData[length - 1];
    if (length > 0 && !SetUtils.isUntouched(lastSet)) {
        let setID = lastSet.setID;
        lastSet.workoutID = workoutID;
        workoutSetIDs.push(setID);
        historyChanges[setID] = lastSet;
    }

    let newSetIDsToUpload = [...state.setIDsToUpload, ...workoutSetIDs];
    const kratosDiscs = state.deviceType === 'Kratos' ? initKratosDiscs : null;

    let newWorkoutData = [
        createSet(1, action.defaultMetric, state.deviceType, kratosDiscs),
    ];
    let newHistoryData = Object.assign({}, state.historyData, historyChanges);

    return Object.assign({}, state, {
        workoutData: newWorkoutData,
        historyData: newHistoryData,
        setIDsToUpload: newSetIDsToUpload
    });
};

// BEGIN_UPLOADING_SETS

const beginUploadingSets = (state, action) => {
    return Object.assign({}, state, {
        setIDsBeingUploaded: [...state.setIDsToUpload],
        setIDsToUpload: [],
    });
};

// FAILED_UPLOAD_SETS

const failedUploadSets = (state, action) => {
    return Object.assign({}, state, {
        setIDsToUpload: [...state.setIDsToUpload, ...state.setIDsBeingUploaded],
        setIDsBeingUploaded: [],
    });
};

// UPDATE_SET_DATA_FROM_SERVER

const updateSetDataFromServer = (state, action) => {
    // valid check
    if (action.sets === null || action.sets === undefined || action.revision === null || action.revision === undefined) {
        // return empty
        return {
            ...state,
            historyData: {},
            revision: 0,
            setIDsToUpload: [],
            setIDsBeingUploaded: [],
        };
    }

    let newHistoryData = {};
    for (set of action.sets) {
        if (set.setID !== null) { // hack check against a bug that showed up in the development database
            newHistoryData[set.setID] = set;
        }
    }

    return Object.assign({}, state, {
        historyData: newHistoryData,
        revision: action.revision,
        setIDsBeingUploaded: [],
    });
};

// LOGIN_SUCCESS

const loginSuccess = (state, action) => {
    const newState = updateSetDataFromServer(state, action);
    return Object.assign({}, newState, {
        revision: action.revision,
        setIDsBeingUploaded: [],
        setIDsToUpload: [],
    });
};

// CLEAR_HISTORY

const clearHistory = (state, action) => {
    return Object.assign({}, state, {
        historyData: {},
        revision: 0,
        setIDsToUpload: [],
        setIDsBeingUploaded: [],
    });
};

// FINISH_UPLOADING_SETS

// this clears the sets being uploaded and updates the revision
const finishUploadingSets = (state, action) => {
    return Object.assign({}, state, {
        setIDsBeingUploaded: [],
        revision: action.revision,
    });
};

// TEST_1RM

const overrideWithTestData = (state, action) => {
    // dump of test data
    var historyData = require('app/configs+constants/TestData.json');

    // alter the date to be based on TODAY
    const originalDateTime = 1518556080000; // this needs to be date of the dump
    const currentDateTime = Date.now();
    const dateDifference = currentDateTime - originalDateTime;
    for (var property in historyData) {
        if (historyData.hasOwnProperty(property)) {
            let set = historyData[property];
            if (set.initialStartTime) {
                set.initialStartTime = addTime(set.initialStartTime, dateDifference);
            }
            if (set.startTime) {
                set.startTime = addTime(set.startTime, dateDifference);
            }
            if (set.endTime) {
                set.endTime = addTime(set.endTime, dateDifference);
            }
            if (set.reps) {
                for (rep of set.reps) {
                    if (rep.time) {
                        rep.time = addTime(rep.time, dateDifference);
                    }
                    const data = rep.data;
                    rep.averageVelocity = Math.round(data[2] * 1000);
                    rep.rom = Math.round(data[3]);
                    rep.peakVelocity = Math.round(data[4] * 1000);
                    rep.peakHeight = Math.round(data[5] / 100 * rep.rom); // need to convert % to number
                    rep.duration = data[6];
                    rep.totalSampleCount = 100; // bullshit, got no 3d data
                    rep.linear3DAverageVelocity = rep.averageVelocity; // just make it average vel
                    rep.linear3DROM = rep.rom; // just make it rom
                }
            }
            historyData[property] = set;
        }
    }

    return {
        ...state,
        workoutData: [createSet()],
        setIDsToUpload: [],
        setIDsBeingUploaded: [],
        revision: 0,
        historyData: historyData,
    };
};

const addTime = (origDate, dateDifference) => {
    return new Date(Date.parse(origDate) + dateDifference);
};

// scalar positions

const add3DPositionsToRep = (state, action) => {
    // get latest set in workout
    let set = state.workoutData[state.workoutData.length - 1];

    // get latest rep in workout
    let rep = set.reps[set.reps.length - 1];

    // add data to rep
    rep = {
        ...rep,
        start: action.start,
        end: action.end,
    };

    // add reps to set object
    const reps = set.reps.slice(0, set.reps.length - 1); // copy all but the last element
    reps.push(rep); // add the updated rep
    set = {
        ...set,
        reps,
    };

    // add set object to workout data
    const workoutData = state.workoutData.slice(0, state.workoutData.length - 1); // copy all but the last element
    workoutData.push(set); // add the updated set
    return {
        ...state,
        workoutData,
    }
};

export default SetsReducer;
