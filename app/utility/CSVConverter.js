// TODO: split this into more functions that don't suck
// TODO: prime candidate for unit testing

import * as DateUtils from 'app/utility/DateUtils';
import * as SetUtils from 'app/utility/SetUtils';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';

// pass this the history sets as a sorted array
// aka SetReducer's getHistorySets convenience function
export const convert = data => {
    // output
    let sets = [...data];
    const isKratosEnabled = getKratosEnabled();

    let output = isKratosEnabled
        ? 'Exercise,Set,Rep,Weight,Metric,Set RPE,Tags,Workout Start Time,Rest Time,Concentric Avg Velocity (m/s),Eccentric Avg Velocity (m/s),Concentric Range of Motion (mm),Eccentric Range of Motion (mm),Concentric Peak Velocity (m/s),Eccentric Peak Velocity (m/s),Concentric Peak Velocity Location (%),Eccentric Peak Velocity Location (%),Concentric Duration of rep (sec),Eccentric Duration of rep (sec)\n'
        : 'Exercise,Set,Rep,Weight,Metric,Set RPE,Tags,Workout Start Time,Rest Time,Avg Velocity (m/s),Range of Motion (mm),Peak Velocity (m/s),Peak Velocity Location (%),Duration of rep (sec)\n';

    // filter removed sets
    sets = sets.filter(set => set.deleted === false && set.reps.length > 0);

    if (!isKratosEnabled) {
        sets = sets.filter(set => set.deviceType !== 'Kratos');
    }
    // vars for calculation
    let lastExercise = null;
    let setCount = 1;
    let lastWorkout = null;
    let workoutStartTime = null;
    let lastSetEndTime = null;
    let rest = null;

    for (const set of sets) {
        // calculate workoutstarttime
        if (lastWorkout === null || lastWorkout !== set.workoutID) {
            lastWorkout = set.workoutID;
            workoutStartTime = new Date(
                SetUtils.startTime(set),
            ).toLocaleString();
            // reset vars for set count and rest time
            lastExercise = null;
            lastSetEndTime = null;
        }

        // calculate setcount
        if (lastExercise !== null && lastExercise === set.exercise) {
            setCount += 1;
        } else {
            setCount = 1;
        }
        lastExercise = set.exercise;

        // calculate rest time
        if (lastSetEndTime !== null) {
            const restInMS =
                new Date(SetUtils.startTime(set)).getTime() -
                new Date(lastSetEndTime).getTime();
            rest = DateUtils.restInClockFormat(restInMS);
        } else {
            rest = '00:00:00';
        }

        lastSetEndTime = SetUtils.endTime(set);

        // reps
        let reps = SetUtils.validUnremovedReps(set);
        let tags = '';

        if (set.tags) {
            tags = set.tags.join();
        }

        if (isKratosEnabled) {
            if (set.deviceType === 'Kratos') {
                reps.forEach((rep, index) => {
                    output += getCommonData(
                        set,
                        index,
                        setCount,
                        tags,
                        workoutStartTime,
                        rest,
                    );
                    output += (rep.cAvgLinearVelocity / 1000).toFixed(2) + ',';
                    output += (rep.eAvgLinearVelocity / 1000).toFixed(2) + ',';
                    output += rep.cRom + ',';
                    output += rep.eRom + ',';
                    output += (rep.cPeakLinearVelocity / 1000).toFixed(2) + ',';
                    output += (rep.ePeakLinearVelocity / 1000).toFixed(2) + ',';
                    output += rep.cPeakVelocityLocation + ',';
                    output += rep.ePeakVelocityLocation + ',';
                    output += rep.cDuration / 1000 + ',';
                    output += rep.eDuration / 1000 + '\n';
                });
            } else {
                reps.forEach((rep, index) => {
                    output += getCommonData(
                        set,
                        index,
                        setCount,
                        tags,
                        workoutStartTime,
                        rest,
                    );
                    output += (rep.averageVelocity / 1000).toFixed(2) + ',,';
                    output += rep.rom + ',,';
                    output += (rep.peakVelocity / 1000).toFixed(2) + ',,';
                    output += rep.peakHeight + ',,';
                    output += rep.duration / 1000 + ',' + '\n';
                });
            }
        } else {
            reps.forEach((rep, index) => {
                output += getCommonData(
                    set,
                    index,
                    setCount,
                    tags,
                    workoutStartTime,
                    rest,
                );
                output += (rep.averageVelocity / 1000).toFixed(2) + ',';
                output += rep.rom + ',';
                output += (rep.peakVelocity / 1000).toFixed(2) + ',';
                output += rep.peakHeight + ',';
                output += rep.duration / 1000 + '\n';
            });
        }
    }

    return output;
};

const getCommonData = (set, index, setCount, tags, workoutStartTime, rest) => {
    let output = '';

    output += escapeDoubleQuote(set.exercise) + ',';
    output += setCount + ',';
    output += index + 1 + ',';
    output += escapeDoubleQuote(set.weight) + ',';
    output += escapeDoubleQuote(set.metric) + ',';
    output += escapeDoubleQuote(set.rpe) + ',';
    output += escapeDoubleQuote(tags) + ',';
    output += escapeDoubleQuote(workoutStartTime) + ',';
    output += escapeDoubleQuote(rest) + ',';

    return output;
};

const escapeDoubleQuote = value => {
    if (typeof value === 'string' || value instanceof String) {
        return '"' + value.replace(/"/g, '""') + '"';
    } else {
        return value;
    }
};
