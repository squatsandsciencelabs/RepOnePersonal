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
        if (!rep) {
            return null;
        }
        
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

export const getData = createSelector(
    getRep,
    rep => {
        if (!rep || !rep.bulkData) {
            return [];
        }

        const data = [];
        for (const index in rep.bulkData) {
            data[parseInt(index)] = rep.bulkData[index];
        }
        return data;
    }
);

export const getColors = createSelector(
    getData,
    data => {
        if (data.length <= 0) {
            return [];
        }

        const speeds = [0];
        for (let i=1; i<data.length; i++) {
            const deltaT = data[i].time-data[i-1].time;
            const prevPoint = new THREE.Vector3(data[i-1].x, data[i-1].y, data[i-1].z);
            const currentPoint = new THREE.Vector3(data[i].x, data[i].y, data[i].z);
            const deltaD = prevPoint.distanceTo(currentPoint);
            const speed = parseFloat(deltaD / deltaT);
            speeds.push(speed);
        }
        const maxSpeed = Math.max(...speeds);
        const halfSpeed = maxSpeed * 0.5;
        const colors = [1, 0, 0];
        speeds.forEach(s => {
            const r = s <= halfSpeed ? 1 : 1 - ((s-halfSpeed) / halfSpeed);
            const g = s >= halfSpeed ? 1 : s / halfSpeed;
            colors.push(r, g, 0);
        });
        return colors;
    }
);

const renderScale = 100;
export const getVertices = createSelector(
    getData,
    data => {
        const vertices = [];
        data.forEach(d => {
            vertices.push(d.x / renderScale);
            vertices.push(d.y / renderScale);
            vertices.push(d.z / renderScale);
        });
        return vertices;
    }
);

export const getNumPoints = state => getData(state).length;

export const getMidpointIndex = createSelector(
    getNumPoints,
    numPoints => {
        return Math.floor(numPoints/2);
    }
);

// TODO: get set description (includes set num which has to be calculated sadly), has to be sep due to calculations for it
// TODO: is working set (so if rep is null, it can display waiting for reps)
// TODO: prev rep id
// TODO: next rep id
// TODO: set total num reps - could just be utils?
// TODO: get current rep number
