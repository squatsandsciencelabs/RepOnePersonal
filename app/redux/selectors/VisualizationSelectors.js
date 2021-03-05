import { createSelector } from 'reselect';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as DurationCalculator from 'app/utility/DurationCalculator';
import * as SetUtils from 'app/utility/SetUtils';

const stateRoot = (state) => state.visualization;

export const getIsShowingVisualization = state => stateRoot(state).setID !== null;

export const getVisualizationSetID = state => stateRoot(state).setID;

export const getVisualizationRepID = state => stateRoot(state).repID;

// for internal calculation uses
const getSet = createSelector(
    getVisualizationSetID,
    SetsSelectors.getWorkoutSets,
    SetsSelectors.getHistorySets,
    (setID, workoutSets, historySets) => {
        if (!setID) {
            return null;
        }

        // NOTE: duplicated logic from setsselectors, but didn't have a choice if I were to perform search like this
        let set = workoutSets.find( set => set.setID == setID );
        if (!set) {
            set = historySets.find( set => set.setID === setID );
        }
        return set;
    }
);

// for internal calculation uses, like current rep, next rep id, prev rep id, etc.
const getReps = createSelector(
    getSet,
    (set) => {
        // empty check
        if (!set || set.deleted || set.removed || !set.reps || set.reps.length <= 0) {
            return [];
        }

        return SetUtils.validUnremovedReps(set);
    }
);

// will be used directly for average vel, peak, bulk, etc. as no reason for additional layer of selectors on it
const getRep = createSelector(
    getVisualizationRepID,
    getReps,
    (repID, reps) => {
        // get last
        if (!repID) {
            return reps[reps.length-1];
        }

        // find specific one
        return reps.find(r => r.id === repID);
    }
);

export const getRepModel = createSelector(
    getRep,
    rep => {
        const vm = {
            averageVelocity: "Invalid",
            peakVelocity: "Invalid",
            peakVelocityLocation: "Invalid",
            linear3DAverageVelocity: "Invalid",
            rangeOfMotion: "Invalid",
            duration: "Invalid",
        };

        let avgVel = rep.averageVelocity;
        if (avgVel !== null) {
            vm.averageVelocity = avgVel / 1000;
        }

        let peakVel = rep.peakVelocity;
        if (peakVel !== null) {
            vm.peakVelocity = peakVel / 1000;
        }

        let peakVelLoc = Math.round(rep.peakHeight / rep.rom * 100);
        if (peakVelLoc !== null) {
            vm.peakVelocityLocation = peakVelLoc;
        }

        if (rep.linear3DAverageVelocity !== null && rep.linear3DAverageVelocity !== undefined) {
            vm.linear3DAverageVelocity = rep.linear3DAverageVelocity / 1000;
        }

        let rom = rep.rom;
        if (rom !== null) {
            vm.rangeOfMotion = rom;
        }

        if (rep.linear3DROM !== null && rep.linear3DROM !== undefined) {
            vm.linear3DROM = rep.linear3DROM;
        }

        let duration = rep.duration;
        if (duration !== null) {
            vm.duration = DurationCalculator.displayDuration(duration);
        } else {
            vm.duration = "-";
        }

        return vm;
    }
);

export const getBulkData = state => getRep(state).bulkData;

// TODO: get set description (includes set num which has to be calculated sadly), has to be sep due to calculations for it
// TODO: is working set (so if rep is null, it can display waiting for reps)
// TODO: prev rep id
// TODO: next rep id
// TODO: set total num reps - could just be utils?
// TODO: get current rep number