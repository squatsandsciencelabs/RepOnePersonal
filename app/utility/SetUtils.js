import * as WeightConversion from 'app/utility/WeightConversion';
import * as DateUtils from 'app/utility/DateUtils';

export const isDeleted = (set) => {
    if (set.hasOwnProperty('deleted')) {
        // new sets used the deleted flag
        return set.deleted;
    } else {
        // old sets use isEmpty checks
        return isEmpty(set);
    }
};

// no data and no active reps
export const isEmpty = (set) => {
    return hasEmptyData(set) && hasEmptyReps(set);
};

// no data and no reps at all
export const isUntouched = (set) => {
    return hasEmptyData(set) && hasNoReps(set);
};

export const hasAllFields = (set) => {
    if (set.exercise && set.weight && set.rpe && set.tags && set.tags.length > 0) {
        return true;
    }
    return false;
};

export const hasEmptyFields = (set) => {
    return !set.exercise && (!set.weight || set.weight === '') && (!set.rpe || set.rpe === '') && (!set.tags || set.tags === undefined || set.tags.length === 0);
};

export const hasEmptyData = (set) => {
    return hasEmptyFields(set) && !set.videoFileURL;
};

export const hasNoReps = (set) => {
    if (set.reps === null || set.reps === undefined) {
        return true;
    }
    return set.reps.length === 0;
};

export const hasEmptyReps = (set) => {
    if (hasNoReps(set)) {
        return true;
    }

    let activeRep = set.reps.find((rep) => { return rep.removed === false; });
    return activeRep === undefined;
};

// NOTE: this considers infinity / 0 invalid
export const usableReps = (set) => {
    if (!set || !set.hasOwnProperty('reps')) {
        return [];
    }
    return set.reps.filter(rep => !rep.removed && isRepUsable(rep));
};

export const hasUnremovedRep = (set) => {
    if (!set || !set.hasOwnProperty('reps')) {
        return false;
    }
    return set.reps.some(rep => !rep.removed);
};

// NOTE: this does not consider infinity / 0 invalid
export const validUnremovedReps = (set) => {
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

export const weightInLBs = (set) => {
    if (!set.hasOwnProperty('weight') || set.weight === null || isNaN(set.weight) || !set.metric) {
        return null;
    } 

    return WeightConversion.weightInLBs(set.metric, set.weight);

};

export const weightInKGs = (set) => {
    if (!set.hasOwnProperty('weight') || set.weight === null || isNaN(set.weight) || !set.metric) {
        return null;
    } 

    return WeightConversion.weightInKGs(set.metric, set.weight);
};

export const numFieldsEntered = (set) => {
    let fields = [set.exercise, set.weight, set.rpe, set.tags.length];
    let num_fields_entered = 0;

    fields.forEach((field) => {
        if (Boolean(field)) {
            num_fields_entered++;
        }
    });
    
    return num_fields_entered;
};

// NOTE: this does not consider infinity / 0 invalid
export const numValidUnremovedReps = (set) => validUnremovedReps(set).length;

// NOTE: this considers infinity / 0 invalid
export const numUsableReps = (set) => usableReps(set).length;

// NOTE: this considers infinity / 0 invalid
export const isRepUsable = (rep) => {
    if (!rep.isValid) {
        return false;
    }
    const velocity = rep.averageVelocity / 1000; // this should always return a string
    const peakVelocity = rep.peakVelocity / 1000;
    return isVelocityUsable(velocity) && isVelocityUsable(peakVelocity);
};

const isVelocityUsable = (velocity) => {
    return !(!velocity || isNaN(velocity) || !isFinite(velocity) || Number(velocity) < 0 || Number(velocity) >= 10);
};

// NOTE: this considers infinity / 0 invalid, but only considers not removed reps
export const hasUnusableReps = (set) => {
    if (!set || !set.hasOwnProperty('reps')) {
        return false;
    }
    return set.reps.some(rep => !rep.removed && !isRepUsable(rep));
};

// NOTE: this considers infinity / 0 invalid
export const getFastestUsableAvgVelocity = (set) => {
    const reps = usableReps(set);
    if (!reps || reps.length === 0) {
        return null;
    }

    return Math.max.apply(Math, reps.map(rep => Number(rep.averageVelocity / 1000)));
};

export const markerDisplayValue = (set, metric) => {
    if (metric === 'lbs') {
        var weight = weightInLBs(set);
    } else {
        var weight = weightInKGs(set);
    }
    return Number(weight).toFixed(2) + metric + ", " + getFastestUsableAvgVelocity(set) + "m/s";
};

// this is here because of legacy issues
// originally, sets saved their start and end times
// however, once rep deletion was added, the rest calculation is off

export const startTime = (set) => {
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

export const endTime = (set) => {
    if (set.endTime === undefined) {
        // time of last rep
        let validReps = validUnremovedReps(set);
        if (validReps.length > 0) {
            return validReps[validReps.length-1].time;
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
        return setExercise.trim().toLowerCase() === exercise.trim().toLowerCase();
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
    const includeTagsInsensitive = tagsToInclude.map(tag => tag.trim().toLowerCase());

    return includeTagsInsensitive.every((tagToInclude) => tagsInsensitive.includes(tagToInclude));
};

export const checkExcludesTags = (tags, tagsToExclude) => {
    // if no tags, or nothing to exclude, it is excluded
    if (!tags || !tagsToExclude.length) {
        return true;
    }

    const tagsInsensitive = tags.map(tag => tag.trim().toLowerCase());
    const excludeTagsInsensitive = tagsToExclude.map(tag => tag.trim().toLowerCase());

    return excludeTagsInsensitive.every((tagToExclude) => !tagsInsensitive.includes(tagToExclude));
};

// starting is the minimum, while ending is the maximum

export const checkWeightRange = (setWeight, setMetric, startingWeight, startingWeightMetric, endingWeight, endingWeightMetric) => {
    // turn into pounds
    const setWeightLBs = WeightConversion.weightInLBs(setMetric, setWeight);
    const startingWeightLBs = WeightConversion.weightInLBs(startingWeightMetric, startingWeight);
    const endingWeightLBs = WeightConversion.weightInLBs(endingWeightMetric, endingWeight);
    
    if (!startingWeightLBs && !endingWeightLBs) {
        return true;
    } else if ((startingWeightLBs || endingWeightLBs) && !setWeightLBs) {
        return false;
    } else if (!startingWeightLBs && endingWeightLBs) {
        return setWeightLBs <= endingWeightLBs;
    } else if (startingWeightLBs && !endingWeightLBs) {
        return setWeightLBs >= startingWeightLBs;
    } else {
        return setWeightLBs >= startingWeightLBs && setWeightLBs <= endingWeightLBs;
    }
};

export const checkRPERange = (setRPE, startingRPE, endingRPE) => {
    // account for commas
    const setRPEWithoutCommas = setRPE ? Number(setRPE.toString().replace(',','.')) : setRPE;
    const startingRPEWithoutCommas = startingRPE ? Number(startingRPE.toString().replace(',','.')) : startingRPE;
    const endingRPEWithoutCommas = endingRPE ? Number(endingRPE.toString().replace(',','.')) : endingRPE;

    if (!startingRPEWithoutCommas && !endingRPEWithoutCommas) {
        return true;
    } else if ((startingRPEWithoutCommas || endingRPEWithoutCommas) && !setRPE) {
        return false;
    } else if (!startingRPEWithoutCommas  && endingRPEWithoutCommas) {
        return setRPEWithoutCommas <= endingRPEWithoutCommas;
    } else if (startingRPEWithoutCommas && !endingRPEWithoutCommas) {
        return setRPEWithoutCommas >= startingRPEWithoutCommas ;
    } else {
        return setRPEWithoutCommas >= startingRPEWithoutCommas && setRPEWithoutCommas <= endingRPEWithoutCommas;
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
        return validUnremovedReps >= startingRepRange && validUnremovedReps <= endingRepRange;
    }
};

// startingDate is the minimum date, ending date is the maximum
export const checkDateRange = (setInitialStartTime, startingDate, endingDate) => {
    if (!startingDate && !endingDate) {
        return true;
    } else if (startingDate && !endingDate) {
        return DateUtils.getDate(setInitialStartTime) >= DateUtils.getDate(startingDate);
    } else if (!startingDate && endingDate) {
        return DateUtils.getDate(setInitialStartTime) <= DateUtils.getDate(endingDate);
    } else {
        return DateUtils.getDate(setInitialStartTime) >= DateUtils.getDate(startingDate) && DateUtils.getDate(setInitialStartTime) <= DateUtils.getDate(endingDate);
    }
};

// Not sure if this belongs in setutils as it actually requires rep, but whatever

export const getDeltaTimes = rep => {
    if (!rep || !rep.bulkData) {
        return [];
    }

    // loop add data
    const times = [0];

    // loop add and modify data
    for (let i=1; i<rep.bulkData.length; i++) {
        // select points
        const bulkData = rep.bulkData[i];
        const prevBulkData = rep.bulkData[i-1];

        // calculate times
        const deltaT = (prevBulkData.time - bulkData.time) / 1000000.0; // microseconds conversion

        // save values
        times.push(deltaT);
    } 

    return times;
}

export const getVelocities = (rep, times=null) => {
    if (!rep || !rep.bulkData) {
        return [];
    }

    // get times if needed
    if (times === null || times === undefined) {
        times = getDeltaTimes(rep);
    }

    // length check
    if (rep.bulkData.length !== times.length) {
        console.tron.log(`Error getVelocities, times length ${times.length} not equal to bulk data length ${rep.bulkData.length}`);
        return null;
    }

    // loop add data
    const velocities = [0];

    // loop add and modify data
    for (let i=1; i<rep.bulkData.length; i++) {
        // select points
        const bulkData = rep.bulkData[i];
        const prevBulkData = rep.bulkData[i-1];
        const deltaT = times[i];

        // calculate velocity
        const prevPoint = new THREE.Vector3(prevBulkData.x, prevBulkData.y, prevBulkData.z);
        const currentPoint = new THREE.Vector3(bulkData.x, bulkData.y, bulkData.z);
        const deltaD = prevPoint.distanceTo(currentPoint) / 100000.0; // 1/10 of a mm conversion
        const velocity = Math.abs(parseFloat(deltaD / deltaT));

        // save values
        velocities.push(velocity);
    }

    // return
    return velocities;
};

export const getAccelerations = (rep, velocities=null, times=null) => {
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
    if (rep.bulkData.length !== times.length || times.length !== velocities.length) {
        console.tron.log(`Error getAccelerations, length of bulk data ${rep.bulkData.length} not equal to times ${times.length} not equal to velocities ${velocities.length}`);
        return null;
    }

    // loop add data
    const accelerations = [0];

    // loop add and modify data
    for (let i=1; i<rep.bulkData.length; i++) {
        // select points
        const velocity = velocities[i];
        const prevVelocity = velocities[i-1];
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

const gravity = 9.80665;
export const getForces = (set, rep, velocities=null) => {
    if (!set || !rep || !rep.bulkData) {
        return [];
    }

    const weight = weightInKGs(set);
    if (weight === null) {
        return [];
    }

    // get velocities if needed
    if (velocities === null || velocities === undefined) {
        velocities = getVelocities(rep);
    }

    const accelerations = getAccelerations(rep, velocities);
    return accelerations.map(a => (a + gravity) * weight);
}

export const getPowers = (set, rep) => {
    const velocities = getVelocities(rep);
    if (velocities.length <= 0) {
        return [];
    }

    const forces = getForces(set, rep, velocities);
    if (forces.length <= 0) {
        return [];
    }

    if (forces.length !== velocities.length) {
        console.tron.log(`Error getPowers, forces length ${forces.length} not equal to velocities length ${velocities.length}`);
        return [];
    }

    return forces.map((f, i) => f * velocities[i]);
};

export const getPeakForce = (set, rep) => {
    const forces = getForces(set, rep);
    if (forces.length <= 0) {
        return null;
    }

    return Math.max(...forces);
};

export const getAverageForce = (set, rep) => {
    const forces = getForces(set, rep);
    if (forces.length <= 0) {
        return null;
    }

    const sum = forces.reduce((a, b) => a + b, 0);
    return sum / forces.length;
};

export const getPeakPower = (set, rep) => {
    const powers = getPowers(set, rep);
    if (powers.length <= 0) {
        return null;
    }

    return Math.max(...powers);
};

export const getAveragePower = (set, rep) => {
    const powers = getPowers(set, rep);
    if (powers.length <= 0) {
        return null;
    }

    const sum = powers.reduce((a, b) => a + b, 0);
    return sum / powers.length;
};
