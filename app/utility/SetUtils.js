import * as WeightConversion from 'app/utility/WeightConversion';
import * as DateUtils from 'app/utility/DateUtils';
import * as DurationCalculator from 'app/utility/DurationCalculator';
import {
    AVG_VELOCITY_METRIC,
    PKV_METRIC,
    PKH_METRIC,
    ROM_METRIC,
    DURATION_METRIC,
    FORCE_METRIC,
    FORCE_HEIGHT_METRIC,
    POWER_METRIC,
    POWER_HEIGHT_METRIC,
    LINEAR_3D_AVG_VELOCITY_METRIC,
    LINEAR_3D_ROM_METRIC,
    WORK_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';
import THREE from 'three';
import {
    getTotalKratosDiscsInertialConstant,
    getTotalKratosDiscsWeights,
} from 'app/utility/KratosUtils';
import { millimetersToMeters } from 'app/utility/DistanceConversion';
import { newtonsToPounds } from 'app/utility/ForceConversion';

// TODO: Update the functions to no longer calculate power and force via bulk data.
//  For context, we were originally going to calculate power and force via bulk data
//  for repone sensor, but this will no longer be the case.

export const isDeleted = set => {
    if (set.hasOwnProperty('deleted')) {
        // new sets used the deleted flag
        return set.deleted;
    } else {
        // old sets use isEmpty checks
        return isEmpty(set);
    }
};

// no data and no active reps
export const isEmpty = set => {
    return hasEmptyData(set) && hasEmptyReps(set);
};

// no data and no reps at all
export const isUntouched = set => {
    return hasEmptyData(set) && hasNoReps(set);
};

export const hasAllFields = set => {
    if (
        set.exercise &&
        set.weight &&
        set.rpe &&
        set.tags &&
        set.tags.length > 0
    ) {
        return true;
    }
    return false;
};

export const hasEmptyFields = set => {
    return (
        !set.exercise &&
        (!set.weight || set.weight === '') &&
        (!set.rpe || set.rpe === '') &&
        (!set.tags || set.tags === undefined || set.tags.length === 0)
    );
};

export const hasEmptyData = set => {
    return hasEmptyFields(set) && !set.videoFileURL;
};

export const hasNoReps = set => {
    if (set.reps === null || set.reps === undefined) {
        return true;
    }
    return set.reps.length === 0;
};

export const hasEmptyReps = set => {
    if (hasNoReps(set)) {
        return true;
    }

    let activeRep = set.reps.find(rep => {
        return rep.removed === false;
    });
    return activeRep === undefined;
};

// NOTE: this considers infinity / 0 invalid
export const usableReps = set => {
    if (!set || !set.hasOwnProperty('reps')) {
        return [];
    }
    return set.reps.filter(rep => !rep.removed && isRepUsable(rep));
};

export const hasUnremovedRep = set => {
    if (!set || !set.hasOwnProperty('reps')) {
        return false;
    }
    return set.reps.some(rep => !rep.removed);
};

// NOTE: this does not consider infinity / 0 invalid
export const validUnremovedReps = set => {
    if (!set || !set.hasOwnProperty('reps')) {
        return [];
    }
    return set.reps.filter(rep => rep.isValid && !rep.removed);
};

export const hasUnremovedRepWith3D = set => {
    if (!set || !set.hasOwnProperty('reps')) {
        return false;
    }
    return set.reps.some(rep => !rep.removed && rep.bulkData);
};

export const weightInLBs = set => {
    if (
        !set.hasOwnProperty('weight') ||
        set.weight === null ||
        isNaN(set.weight) ||
        !set.metric
    ) {
        return null;
    }

    return WeightConversion.weightInLBs(set.metric, set.weight);
};

export const weightInKGs = set => {
    if (
        !set.hasOwnProperty('weight') ||
        set.weight === null ||
        isNaN(set.weight) ||
        !set.metric
    ) {
        return null;
    }

    return WeightConversion.weightInKGs(set.metric, set.weight);
};

export const numFieldsEntered = set => {
    let fields = [set.exercise, set.weight, set.rpe, set.tags.length];
    let num_fields_entered = 0;

    fields.forEach(field => {
        if (Boolean(field)) {
            num_fields_entered++;
        }
    });

    return num_fields_entered;
};

// NOTE: this does not consider infinity / 0 invalid
export const numValidUnremovedReps = set => validUnremovedReps(set).length;

// NOTE: this considers infinity / 0 invalid
export const numUsableReps = set => usableReps(set).length;

// NOTE: this considers infinity / 0 invalid
export const isRepUsable = rep => {
    if (!rep.isValid) {
        return false;
    }
    const velocity = rep.averageVelocity / 1000; // this should always return a string
    const peakVelocity = rep.peakVelocity / 1000;
    return isVelocityUsable(velocity) && isVelocityUsable(peakVelocity);
};

const isVelocityUsable = velocity => {
    return !(
        !velocity ||
        isNaN(velocity) ||
        !isFinite(velocity) ||
        Number(velocity) < 0 ||
        Number(velocity) >= 10
    );
};

// NOTE: this considers infinity / 0 invalid, but only considers not removed reps
export const hasUnusableReps = set => {
    if (!set || !set.hasOwnProperty('reps')) {
        return false;
    }
    return set.reps.some(rep => !rep.removed && !isRepUsable(rep));
};

// NOTE: this considers infinity / 0 invalid
export const getFastestUsableAvgVelocity = set => {
    const reps = usableReps(set);
    if (!reps || reps.length === 0) {
        return null;
    }

    return Math.max.apply(
        Math,
        reps.map(rep => Number(rep.averageVelocity / 1000)),
    );
};

export const markerDisplayValue = (set, metric) => {
    if (metric === 'lbs') {
        var weight = weightInLBs(set);
    } else {
        var weight = weightInKGs(set);
    }
    return (
        Number(weight).toFixed(2) +
        metric +
        ', ' +
        getFastestUsableAvgVelocity(set) +
        'm/s'
    );
};

// this is here because of legacy issues
// originally, sets saved their start and end times
// however, once rep deletion was added, the rest calculation is off

export const startTime = set => {
    if (!set) {
        return null;
    } else if (set.startTime === undefined) {
        // time of first rep
        let validReps = validUnremovedReps(set);
        if (validReps.length > 0 && validReps[0].time !== undefined) {
            return validReps[0].time;
        } else if (set.initialStartTime !== undefined) {
            return set.initialStartTime;
        } else {
            return null;
        }
    } else {
        // legacy time of set itself
        return set.startTime;
    }
};

export const endTime = set => {
    if (set.endTime === undefined) {
        // time of last rep
        let validReps = validUnremovedReps(set);
        if (validReps.length > 0) {
            return validReps[validReps.length - 1].time;
        } else {
            return null;
        }
    } else {
        // legacy time of set itself
        return set.endTime;
    }
};

export const checkExercise = (setExercise, exercise) => {
    if (!exercise) {
        return true;
    } else if (exercise && !setExercise) {
        false;
    } else {
        return (
            setExercise.trim().toLowerCase() === exercise.trim().toLowerCase()
        );
    }
};

export const checkIncludesTags = (tags, tagsToInclude) => {
    // nothing to include, it's fine
    if (!tagsToInclude.length) {
        return true;
    }
    // no tags, cannot possibly include
    if (!tags) {
        return false;
    }

    const tagsInsensitive = tags.map(tag => tag.trim().toLowerCase());
    const includeTagsInsensitive = tagsToInclude.map(tag =>
        tag.trim().toLowerCase(),
    );

    return includeTagsInsensitive.every(tagToInclude =>
        tagsInsensitive.includes(tagToInclude),
    );
};

export const checkExcludesTags = (tags, tagsToExclude) => {
    // if no tags, or nothing to exclude, it is excluded
    if (!tags || !tagsToExclude.length) {
        return true;
    }

    const tagsInsensitive = tags.map(tag => tag.trim().toLowerCase());
    const excludeTagsInsensitive = tagsToExclude.map(tag =>
        tag.trim().toLowerCase(),
    );

    return excludeTagsInsensitive.every(
        tagToExclude => !tagsInsensitive.includes(tagToExclude),
    );
};

// starting is the minimum, while ending is the maximum

export const checkWeightRange = (
    setWeight,
    setMetric,
    startingWeight,
    startingWeightMetric,
    endingWeight,
    endingWeightMetric,
    deviceType,
    kratosDiscs,
) => {
    // turn into pounds
    const setWeightLBs =
        deviceType === 'Kratos'
            ? getTotalKratosDiscsWeights(kratosDiscs)
            : WeightConversion.weightInLBs(setMetric, setWeight);
    const startingWeightLBs = WeightConversion.weightInLBs(
        startingWeightMetric,
        startingWeight,
    );
    const endingWeightLBs = WeightConversion.weightInLBs(
        endingWeightMetric,
        endingWeight,
    );

    if (!startingWeightLBs && !endingWeightLBs) {
        return true;
    } else if ((startingWeightLBs || endingWeightLBs) && !setWeightLBs) {
        return false;
    } else if (!startingWeightLBs && endingWeightLBs) {
        return setWeightLBs <= endingWeightLBs;
    } else if (startingWeightLBs && !endingWeightLBs) {
        return setWeightLBs >= startingWeightLBs;
    } else {
        return (
            setWeightLBs >= startingWeightLBs && setWeightLBs <= endingWeightLBs
        );
    }
};

export const checkRPERange = (setRPE, startingRPE, endingRPE) => {
    // account for commas
    const setRPEWithoutCommas = setRPE
        ? Number(setRPE.toString().replace(',', '.'))
        : setRPE;
    const startingRPEWithoutCommas = startingRPE
        ? Number(startingRPE.toString().replace(',', '.'))
        : startingRPE;
    const endingRPEWithoutCommas = endingRPE
        ? Number(endingRPE.toString().replace(',', '.'))
        : endingRPE;

    if (!startingRPEWithoutCommas && !endingRPEWithoutCommas) {
        return true;
    } else if (
        (startingRPEWithoutCommas || endingRPEWithoutCommas) &&
        !setRPE
    ) {
        return false;
    } else if (!startingRPEWithoutCommas && endingRPEWithoutCommas) {
        return setRPEWithoutCommas <= endingRPEWithoutCommas;
    } else if (startingRPEWithoutCommas && !endingRPEWithoutCommas) {
        return setRPEWithoutCommas >= startingRPEWithoutCommas;
    } else {
        return (
            setRPEWithoutCommas >= startingRPEWithoutCommas &&
            setRPEWithoutCommas <= endingRPEWithoutCommas
        );
    }
};

export const checkRepRange = (set, startingRepRange, endingRepRange) => {
    const validUnremovedReps = numValidUnremovedReps(set);

    if (!startingRepRange && !endingRepRange) {
        return true;
    } else if (!startingRepRange && endingRepRange) {
        return validUnremovedReps <= endingRepRange;
    } else if (startingRepRange && !endingRepRange) {
        return validUnremovedReps >= startingRepRange;
    } else {
        return (
            validUnremovedReps >= startingRepRange &&
            validUnremovedReps <= endingRepRange
        );
    }
};

// startingDate is the minimum date, ending date is the maximum
export const checkDateRange = (
    setInitialStartTime,
    startingDate,
    endingDate,
) => {
    if (!startingDate && !endingDate) {
        return true;
    } else if (startingDate && !endingDate) {
        return (
            DateUtils.getDate(setInitialStartTime) >=
            DateUtils.getDate(startingDate)
        );
    } else if (!startingDate && endingDate) {
        return (
            DateUtils.getDate(setInitialStartTime) <=
            DateUtils.getDate(endingDate)
        );
    } else {
        return (
            DateUtils.getDate(setInitialStartTime) >=
                DateUtils.getDate(startingDate) &&
            DateUtils.getDate(setInitialStartTime) <=
                DateUtils.getDate(endingDate)
        );
    }
};

export const checkDevice = (setDeviceType, devices) =>
    devices.length === 0
        ? true
        : devices.some(device => device.includes(setDeviceType));

// Not sure if this belongs in setutils as it actually requires rep, but whatever

export const getBulkArray = rep => {
    if (!rep || !rep.bulkData) {
        return [];
    }

    // loop add data
    const data = [];
    for (const index in rep.bulkData) {
        data[parseInt(index)] = { ...rep.bulkData[index] };
    }

    // return
    return data;
};

export const getDeltaTimes = (rep, bulkData = null) => {
    if (!rep) {
        return [];
    }

    // get bulk if needed
    if (bulkData === null || bulkData === undefined) {
        bulkData = getBulkArray(rep);
    }

    // loop add data
    const times = [0];

    // loop add and modify data
    for (let i = 1; i < bulkData.length; i++) {
        // select points
        const current = bulkData[i];
        const prev = bulkData[i - 1];

        // calculate times
        const deltaT = (prev.time - current.time) / 1000000.0; // microseconds conversion

        // save values
        times.push(deltaT);
    }

    return times;
};

export const getVelocities = (rep, times = null, bulkData = null) => {
    if (!rep || !rep.bulkData) {
        return [];
    }

    // get bulk if needed
    if (bulkData === null || bulkData === undefined) {
        bulkData = getBulkArray(rep);
    }

    // get times if needed
    if (times === null || times === undefined) {
        times = getDeltaTimes(rep, bulkData);
    }

    // length check
    if (bulkData.length !== times.length) {
        console.tron.log(
            `Error getVelocities, times length ${times.length} not equal to bulk data length ${bulkData.length}`,
        );
        return null;
    }

    // loop add and modify data
    const velocities = [0];
    for (let i = 1; i < bulkData.length; i++) {
        // select points
        const current = bulkData[i];
        const prev = bulkData[i - 1];
        const deltaT = times[i];

        // calculate velocity
        const prevPoint = new THREE.Vector3(prev.x, prev.y, prev.z);
        const currentPoint = new THREE.Vector3(current.x, current.y, current.z);
        const deltaD = prevPoint.distanceTo(currentPoint) / 10000.0; // 1/10 of a mm conversion
        const velocity = Math.abs(parseFloat(deltaD / deltaT));

        // save values
        velocities.push(velocity);
    }

    // return
    return velocities;
};

export const getAccelerations = (rep, velocities = null, times = null) => {
    // valid check
    if (!rep || !rep.bulkData) {
        return [];
    }

    // get times if needed
    if (times === null || times === undefined) {
        times = getDeltaTimes(rep);
    }

    // get velocities if needed
    if (velocities === null || velocities === undefined) {
        velocities = getVelocities(rep, times);
    }

    // length check
    if (times.length !== velocities.length) {
        console.tron.log(
            `Error getAccelerations, length of times ${times.length} not equal to velocities ${velocities.length}`,
        );
        return null;
    }

    // loop add and modify data
    const accelerations = [0];
    for (let i = 1; i < times.length; i++) {
        // select points
        const velocity = velocities[i];
        const prevVelocity = velocities[i - 1];
        const deltaT = times[i];

        // calculate acceleration
        const deltaV = velocity - prevVelocity;
        const acceleration = Math.abs(parseFloat(deltaV / deltaT));

        // save values
        accelerations.push(acceleration);
    }

    // return
    return accelerations;
};

const maxIndexFunction = (maxIndex, compareValue, compareIndex, array) =>
    compareValue > array[maxIndex] ? compareIndex : maxIndex;

export const getPeakVelocityIndex = (rep, velocities = null) => {
    // get velocities if needed
    if (velocities === null || velocities === undefined) {
        velocities = getVelocities(rep);
    }
    if (velocities.length <= 0) {
        return null;
    }

    return velocities.reduce(maxIndexFunction, 0);
};

export const getPeakAccelerationIndex = (rep, accelerations = null) => {
    // get arrays if needed
    if (accelerations === null || accelerations === undefined) {
        accelerations = getAccelerations(rep);
    }

    return accelerations.reduce(maxIndexFunction, 0);
};

const gravity = 9.80665;
export const getForces = (
    set,
    rep,
    accelerations = null,
    velocities = null,
) => {
    if (!set || !rep || !rep.bulkData) {
        return [];
    }

    const weight = weightInKGs(set);
    if (weight === null) {
        return [];
    }

    // get arrays if needed
    if (accelerations === null || accelerations === undefined) {
        if (velocities === null || velocities === undefined) {
            velocities = getVelocities(rep);
        }
        accelerations = getAccelerations(rep, velocities);
    }

    // return
    return accelerations.map(a => (a + gravity) * weight);
};

export const getPowers = (set, rep, forces = null, velocities = null) => {
    // get velocities if needed
    if (velocities === null || velocities === undefined) {
        velocities = getVelocities(rep);
    }
    if (velocities.length <= 0) {
        return [];
    }

    // get forces if needed
    if (forces === null || forces === undefined) {
        forces = getForces(set, rep, null, velocities);
    }
    if (forces.length <= 0) {
        return [];
    }

    if (forces.length !== velocities.length) {
        console.tron.log(
            `Error getPowers, forces length ${forces.length} not equal to velocities length ${velocities.length}`,
        );
        return [];
    }

    return forces.map((f, i) => f * velocities[i]);
};

export const getPeakForceIndex = (set, rep, forces = null) => {
    // get forces if needed
    if (forces === null || forces === undefined) {
        forces = getForces(set, rep);
    }
    if (forces.length <= 0) {
        return null;
    }

    return forces.reduce(maxIndexFunction, 0);
};

export const getAverageForce = (set, rep, forces = null) => {
    // get forces if needed
    if (forces === null || forces === undefined) {
        forces = getForces(set, rep);
    }
    if (forces.length <= 0) {
        return null;
    }

    const sum = forces.reduce((a, b) => a + b, 0);
    return sum / forces.length;
};

export const getPeakPowerIndex = (set, rep, powers = null) => {
    // get powers if needed
    if (powers === null || powers === undefined) {
        powers = getPowers(set, rep);
    }
    if (powers.length <= 0) {
        return null;
    }

    return powers.reduce(maxIndexFunction, 0);
};

export const getAveragePower = (set, rep, powers = null) => {
    // get powers if needed
    if (powers === null || powers === undefined) {
        powers = getPowers(set, rep);
    }
    if (powers.length <= 0) {
        return null;
    }

    const sum = powers.reduce((a, b) => a + b, 0);
    return sum / powers.length;
};

export const getPeakHeight = (bulkDataArray, peakIndex) => {
    if (!bulkDataArray || bulkDataArray.length <= 1) {
        return null;
    }

    const initial = bulkDataArray[0].z;
    const peak = bulkDataArray[peakIndex].z;
    const final = bulkDataArray[bulkDataArray.length - 1].z;

    return Math.round((100 * (peak - initial)) / (final - initial));
};

// display helpers, mayb should go into another file honestly

const INVALID = 'INV';
const EMPTY = '---';

export const getDisplayMetric = (metric, rep, set = null) =>
    formatMetric(_getDisplayMetric(metric, rep, set));

export const getKratosDisplayMetric = (metric, rep, set = null) =>
    formatMetric(_getKratosDisplayMetric(metric, rep, set));

export const formatMetric = metric =>
    metric < 1 && metric > 0 ? metric.toString().slice(1) : metric;

const _getDisplayMetric = (metric, rep, set = null) => {
    if (!rep || !rep.isValid) {
        return INVALID;
    }

    switch (metric) {
        case AVG_VELOCITY_METRIC:
            return rep.averageVelocity ? rep.averageVelocity / 1000 : INVALID;
        case LINEAR_3D_AVG_VELOCITY_METRIC:
            return rep.linear3DAverageVelocity
                ? rep.linear3DAverageVelocity / 1000
                : INVALID;
        case PKV_METRIC:
            return rep.peakVelocity ? rep.peakVelocity / 1000 : INVALID;
        case PKH_METRIC:
            return rep.peakHeight && rep.rom
                ? Math.round((rep.peakHeight / rep.rom) * 100)
                : INVALID;
        case ROM_METRIC:
            return rep.rom ? rep.rom : INVALID;
        case LINEAR_3D_ROM_METRIC:
            return rep.linear3DROM ? rep.linear3DROM : INVALID;
        case DURATION_METRIC:
            return rep.duration
                ? DurationCalculator.displayDuration(rep.duration)
                : INVALID;
        case FORCE_METRIC:
            return rep.peakForce
                ? Number(newtonsToPounds(rep.peakForce)).toFixed(2)
                : EMPTY;
        case FORCE_HEIGHT_METRIC:
            return rep.peakForceHeight ? rep.peakForceHeight : EMPTY;
        case POWER_METRIC:
            return rep.peakPower ? Number(rep.peakPower).toFixed(2) : EMPTY;
        case POWER_HEIGHT_METRIC:
            return rep.peakPowerHeight ? rep.peakPowerHeight : EMPTY;
        default:
            return INVALID;
    }
};

// NOTE: This expects a normalized Kratos rep where it only shows either eccentric or concentric
// See workoutscreen, historyscreen, and onermeditscreen for conversion logic
const _getKratosDisplayMetric = (metric, rep, set = null) => {
    if (!rep || !rep.isValid) {
        return INVALID;
    }

    let mass = null;
    let totalInertialConstant = null;

    switch (metric) {
        case AVG_VELOCITY_METRIC:
            return rep.avgLinearVelocity
                ? rep.avgLinearVelocity / 1000
                : INVALID;
        case LINEAR_3D_AVG_VELOCITY_METRIC:
            return rep.linear3DAverageVelocity
                ? rep.linear3DAverageVelocity / 1000
                : INVALID;
        case PKV_METRIC:
            return rep.peakLinearVelocity
                ? rep.peakLinearVelocity / 1000
                : INVALID;
        case ROM_METRIC:
            return rep.rom ? rep.rom : INVALID;
        case LINEAR_3D_ROM_METRIC:
            return rep.linear3DROM ? rep.linear3DROM : INVALID;
        case DURATION_METRIC:
            return rep.duration
                ? DurationCalculator.displayDuration(rep.duration)
                : INVALID;
        case FORCE_METRIC:
            totalInertialConstant = getTotalKratosDiscsInertialConstant(
                set.kratosDiscs,
            );
            return totalInertialConstant
                ? Number(
                      newtonsToPounds(rep.partialPeakForce) *
                          totalInertialConstant,
                  ).toFixed(2)
                : EMPTY;
        case FORCE_HEIGHT_METRIC:
            return rep.peakForceHeight ? rep.peakForceHeight : EMPTY;
        case POWER_METRIC:
            totalInertialConstant = getTotalKratosDiscsInertialConstant(
                set.kratosDiscs,
            );
            return totalInertialConstant
                ? Number(rep.partialPeakPower * totalInertialConstant).toFixed(
                      2,
                  )
                : EMPTY;
        case POWER_HEIGHT_METRIC:
            return rep.peakPowerHeight ? rep.peakPowerHeight : EMPTY;
        case WORK_METRIC:
            totalInertialConstant = getTotalKratosDiscsInertialConstant(
                set.kratosDiscs,
            );
            return totalInertialConstant
                ? Number(
                      rep.partialPeakForce *
                          totalInertialConstant *
                          millimetersToMeters(rep.rom),
                  ).toFixed(2)
                : EMPTY;
        default:
            return INVALID;
    }
};

export const getKratosRepRows = rep => {
    let resultReps = { concentric: {}, eccentric: {} };

    for (const [key, value] of Object.entries(rep)) {
        if (/([a-z])([A-Z])/.test(key) && (key[0] === 'c' || key[0] === 'e')) {
            const res = {};
            const repProperty = key.charAt(1).toLowerCase() + key.slice(2);
            res[repProperty] = value;

            if (key[0] === 'c') {
                resultReps.concentric = {
                    ...resultReps.concentric,
                    ...res,
                };
            } else {
                resultReps.eccentric = {
                    ...resultReps.eccentric,
                    ...res,
                };
            }
        } else {
            Object.keys(resultReps).forEach(k => {
                const repData = {};

                repData[key] = value;
                resultReps[k] = {
                    ...resultReps[k],
                    ...repData,
                };
            });
        }
    }
    return resultReps;
};

export const getRepHasBulkComputedProperties = r => {
    return (
        (r.peakForce !== null && r.peakForce !== undefined) ||
        (r.averageForce !== null && r.averageForce !== undefined) ||
        (r.peakPower !== null && r.peakPower !== undefined) ||
        (r.averagePower !== null && r.averagePower !== undefined)
    );
};

export const getCanProcessForceOrMetric = (set, rep) => {
    if (!set || !rep || !rep.bulkData) {
        return false;
    }

    const weight = weightInKGs(set);
    if (weight === null) {
        return false;
    }

    return true;
};
