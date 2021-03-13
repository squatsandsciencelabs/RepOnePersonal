import { createSelector } from 'reselect';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as DurationCalculator from 'app/utility/DurationCalculator';
import * as SetUtils from 'app/utility/SetUtils';

const stateRoot = (state) => state.visualization;

export const getIsShowingVisualization = state => stateRoot(state).setID !== null;

export const getVisualizationSetID = state => stateRoot(state).setID;

const getVisualizationRepIndex = state => stateRoot(state).repIndex;

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

        return set.reps;
    }
);

export const getSetExercise = createSelector(
    getVisualizationSetID,
    SetsSelectors.getWorkoutSets,
    SetsSelectors.getHistorySets,
    (setID, workoutSets, historySets) => {
        // valid check
        if (!setID) {
            return null;
        }

        // find it
        let setIndex = workoutSets.findIndex( set => set.setID == setID );
        let array;
        if (setIndex === -1) {
            setIndex = historySets.findIndex( set => set.setID === setID );
            array = historySets;
        } else {
            array = workoutSets;
        }
        const currentSet = array[setIndex];

        // search for exercise number
        let setNumber = 1;
        for (let i=setIndex-1; i>=0; i--) {
            const set = array[i];

            // ignore removed
            if (SetUtils.isDeleted(set)) {
                continue;
            }

            // break out if it's considered different
            if (set.exercise !== currentSet.exercise || set.workoutID !== currentSet.workoutID) {
                break;
            }

            // decrement
            setNumber++;
        }

        // return
        return `${currentSet.exercise} #${setNumber}`;
    }
);

export const getSelectedRepIndex = createSelector(
    getVisualizationRepIndex,
    getReps,
    (index, reps) => {
        if (index === null) {
            for (let i=reps.length-1; i>=0; i--) {
                const rep = reps[i];
                if (rep.isValid && !rep.removed) {
                    return i;
                }
            }
            return null;
        }
        return index;
    }
);

const getRep = createSelector(
    getSelectedRepIndex,
    getReps,
    (index, reps) => {
        if (index === null) {
            return null;
        }
        return reps[index];
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
            vm.averageVelocity = Number(avgVel / 1000.0).toFixed(2);
        }

        let peakVel = rep.peakVelocity;
        if (peakVel !== null) {
            vm.peakVelocity = Number(peakVel / 1000).toFixed(2);
        }

        let peakVelLoc = Math.round(rep.peakHeight / rep.rom * 100);
        if (peakVelLoc !== null) {
            vm.peakVelocityLocation = peakVelLoc;
        }

        if (rep.linear3DAverageVelocity !== null && rep.linear3DAverageVelocity !== undefined) {
            vm.linear3DAverageVelocity = Number(rep.linear3DAverageVelocity / 1000.0).toFixed(2);
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
    (rep) => {
        if (!rep || !rep.bulkData || rep.rom === 519) {
            return [];
        }

        // loop add data
        const data = [];
        for (const index in rep.bulkData) {
            data[parseInt(index)] = { ...rep.bulkData[index] };
        }

        // set velocity and accel for initial point
        if (data.length > 0) {
            const bulkData = data[0];
            bulkData.velocity = 0;
            bulkData.acceleration = 0;
            bulkData.color = `rgba(255, 0, 0, 1)`;
        }

        // loop add and modify data
        const speeds = [0];
        for (let i=1; i<data.length; i++) {
            // select points
            const bulkData = data[i];
            const prevBulkData = data[i-1];

            // calculate velocity
            const deltaT = (prevBulkData.time - bulkData.time) / 1000000.0; // microseconds conversion
            const prevPoint = new THREE.Vector3(prevBulkData.x, prevBulkData.y, prevBulkData.z);
            const currentPoint = new THREE.Vector3(bulkData.x, bulkData.y, bulkData.z);
            const deltaD = prevPoint.distanceTo(currentPoint) / 100000.0; // 1/10 of a mm conversion
            const velocity = Math.abs(parseFloat(deltaD / deltaT));

            // calculate acceleration
            const deltaV = velocity - prevBulkData.velocity;
            const acceleration = Math.abs(parseFloat(deltaV / deltaT));

            // save values
            bulkData.velocity = velocity;
            bulkData.acceleration = acceleration;
            speeds.push(velocity);
        }

        // to fixed
        data.forEach((d) => {
            d.displayTime = Number(d.time / 1000000.0).toFixed(2);
            d.displayVelocity = Number(d.velocity).toFixed(2);
            d.displayAcceleration = Number(d.acceleration).toFixed(2);
        });

        // colors
        const maxSpeed = Math.max(...speeds);
        const halfSpeed = maxSpeed * 0.5;
        speeds.forEach((s, index) => {
            const r = s <= halfSpeed ? 1 : 1 - ((s-halfSpeed) / halfSpeed);
            const g = s >= halfSpeed ? 1 : s / halfSpeed;
            data[index].color = `rgba(${r*255}, ${g*255}, 0, 1)`;
        });

        // return
        return data;
    }
);

// TODO: refactor so it doesn't recalculate speeds and colors again
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

export const getNextRepIndex = createSelector(
    getReps,
    getSelectedRepIndex,
    (reps, selectedIndex) => {
        for (let i=selectedIndex+1; i<reps.length; i++) {
            const rep = reps[i];
            if (rep.isValid && !rep.removed) {
                // confirming if it's last or not
                for (j=i+1; j<reps.length; j++) {
                    const rep = reps[j];
                    if (rep.isValid && !rep.removed) {
                        // found another rep that counts, return i as i is not the last possible
                        return i;
                    }
                }

                // found it but it's the last one, return null so it always snaps to the last
                return null;
            }
        }
        return null;
    }
);

export const getPrevRepIndex = createSelector(
    getReps,
    getSelectedRepIndex,
    (reps, selectedIndex) => {
        for (let i=selectedIndex-1; i>=0; i--) {
            const rep = reps[i];
            if (rep.isValid && !rep.removed) {
                return i;
            }
        }
        return null;
    }
);

const getSelectedRepNumber = createSelector(
    getReps,
    getSelectedRepIndex,
    (reps, index) => {
        if (index === null) {
            return 0;
        }

        let number = 1;
        for (let i=0; i<reps.length; i++) {
            const rep = reps[i];
            if (!rep.isValid || rep.removed) {
                continue;
            }

            if (i === index) {
                return number;                
            } else {
                number++;
            }
        }
        return null; // something went wrong, couldn't find the selected rep index
    }
);

export const getRepTitleText = createSelector(
    getSet,
    getSelectedRepNumber,
    (set, repNumber) => {
        if (repNumber === null) {
            return null;
        }
        
        const numReps = SetUtils.numValidUnremovedReps(set);
        if (numReps <= 0) {
            return `Waiting...`;
        }

        return `Rep ${repNumber} of ${numReps}`;
    }
);

export const getRepNavigationText = createSelector(
    getSet,
    getSelectedRepNumber,
    (set, repNumber) => {
        if (repNumber === null) {
            return null;
        }
        
        const numReps = SetUtils.numValidUnremovedReps(set);
        if (numReps <= 0) {
            return null;
        }

        return `${repNumber} / ${numReps}`;
    }
);

export const getErrorMessage = createSelector(
    getSet,
    getSelectedRepNumber,
    getData,
    (set, repNumber, data) => {
        if (repNumber === null) {
            return 'Error, something went wrong';
        }

        const numReps = SetUtils.numValidUnremovedReps(set);
        if (numReps <= 0) {
            return `Waiting for 3D rep data`;
        }

        if (data.length <= 0) {
            return `No 3D rep data`;
        }

        return null;
    }
);
