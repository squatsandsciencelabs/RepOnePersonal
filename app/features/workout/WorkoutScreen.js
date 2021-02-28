import { Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as DateUtils from 'app/utility/DateUtils';
import * as SetUtils from 'app/utility/SetUtils';
import * as DurationCalculator from 'app/utility/DurationCalculator'
import WorkoutList from './WorkoutList';
import * as Actions from './WorkoutActions';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';
import * as WorkoutCollapsedSelectors from 'app/redux/selectors/WorkoutCollapsedSelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as AuthSelectors from 'app/redux/selectors/AuthSelectors';

// assumes chronological sets
const createViewModels = (sets, collapsedModel, can3D) => {
    // declare variables
    let section = { key: 1, data: [], isLast: true }; // contains the actual data
    let sections = [section]; // the return value
    let lastExerciseName = null; // to help calculate set numbers
    let setNumber = 1; // set number to display
    let lastSetEndTime = null; // to help calculate rest time
    let isInitialSet = true; // to help determine when to display rest time and split up the sections properly
    let count = 0;
    let isLastSet = false; // to set up the live set footer
    let isCollapsed = false;
    let isRemoved = false;

    // build view models
    sets.map((set) => {
        // last section check, splitting the "current set" out for footer purposes
        // TODO: depending on design for "finish current set", can put all the data in one section instead
        if (count === sets.length-1) {
            section = { key: 0, data: [], position: -1, isLast: false };
            sections.splice(0, 0, section); // insert at beginning
            isLastSet = true;
        }

        // set card data
        let array = [0, 0];

        // set state booleans
        isCollapsed = isLastSet ? false : collapsedModel[set.setID] !== false; // TODO: make this cleaner, old method was isCollapsed = isLastSet ? false : WorkoutCollapsedSelectors.getIsCollapsed(state, set.setID);
        isRemoved = isLastSet ? false : SetUtils.isDeleted(set);

        // card header logic
        if (isInitialSet) {
            lastExerciseName = null;
            setNumber = 1;
        } else if (!isRemoved) {
            if (lastExerciseName !== null && lastExerciseName === set.exercise) {
                setNumber++;
            } else {
                setNumber = 1;
            }
        }

        // card header view
        if (isLastSet) {
            array.push({type: 'working set header', key: set.setID+'end set timer'});
        }
        const setHasUnremovedRepWith3D = SetUtils.hasUnremovedRepWith3D(set);
        if (!isRemoved) {
            array.push(createTopBorder(set));
            array.push(createTitleViewModel(set, setNumber, lastExerciseName, isLastSet, isCollapsed));
            if (!isCollapsed) {
                array.push(createFormViewModel(set, setNumber, isRemoved));
                if (!isRemoved) {
                    array.push(createAnalysisViewModel(set));
                }
                if (isLastSet || set.reps.length > 0) {
                    if ((isLastSet && can3D) || setHasUnremovedRepWith3D) {
                        array.push({type: 'open 3d button', key: set.setID+"open 3d button"}); // TODO: update this better
                    }
                    array.push({type: "subheader", key: set.setID+"subheader"});
                }
            } else if (!isRemoved) {
                array.push(createSummaryViewModel(set));
                array.push(createAnalysisViewModel(set));
            }
            lastExerciseName = set.exercise;
        } else {
            array.push(createRestoreViewModel(set));
        }

        // reps
        if (!isRemoved && !isCollapsed) {
            Array.prototype.push.apply(array, createRowViewModels(set));
        }

        // rest footer
        if (isInitialSet) {
            // new set, reset the end time
            lastSetEndTime = isRemoved ? null : SetUtils.endTime(set);
            if (setHasUnremovedRepWith3D) {
                // add rest footer anyways just for the 3D button
                array.push(createRestVM(set, null, isCollapsed, isLastSet, setHasUnremovedRepWith3D));
            }
        } else if (!isRemoved && SetUtils.hasUnremovedRep(set)) { // ignore removed sets in rest calculations
            // add footer if valid
            if (lastSetEndTime !== null || setHasUnremovedRepWith3D) {
                array.push(createRestVM(set, lastSetEndTime, isCollapsed, isLastSet, setHasUnremovedRepWith3D));
            }

            // update variable for calculation purposes
            lastSetEndTime = SetUtils.endTime(set);
        } else if (isLastSet && lastSetEndTime !== null && set.reps.length === 0) {
            // working set, live rest mode
            array.push(createWorkingSetFooterVM(set, lastSetEndTime));
        }

        // delete set row
        if (isLastSet) {
            if (lastSetEndTime === null || set.reps.length > 0) {
                array.push(createBottomBorder(set));
            }
        } else {
            if (!isRemoved && !isCollapsed) {
                array.push(createDeleteVM(set));
            } else {
                array.push(createBottomBorder(set));
            }
        }

        // insert set card data
        Array.prototype.splice.apply(section.data, array);

        // increment and reset
        isInitialSet = false;
        count++;
    });

    // add positions
    for (var i = 0; i < sections.length; i++) {
        sections[i].position = i;
    }

    // return
    return sections;
}

const createTopBorder = (set) => ({
    type: 'top border',
    key: set.setID + 'topborder',
});

const createRestoreViewModel = (set) => {
    const numReps = SetUtils.numValidUnremovedReps(set);
    return {
        type: 'restore',
        setID: set.setID,
        exercise: set.exercise ? set.exercise.toLowerCase() : null,
        weight: set.weight ? set.weight : 0,
        rpe: set.rpe ? set.rpe : 0,
        numReps: numReps ? numReps : '0 reps',
        metric: set.metric,
        tags: set.tags ? set.tags.map((tag) => tag.toLowerCase()) : [],
        key: set.setID + 'restore',
    };
};

// TODO: remove hack fix, see https://github.com/react-native-community/react-native-video/issues/1572
const getVideoFileURL = (set) => {
    // Android
    if (Platform.OS !== 'ios') {
        return set.videoFileURL;
    }

    // iOS Hack Fix
    if (!set.videoFileURL) {
        return null;
    }
    if (!set.videoFileURL.startsWith('ph://')) {
        return set.videoFileURL;
    }
    const appleId = set.videoFileURL.substring(5, 41);
    const ext = 'mov';
    return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
};

const createTitleViewModel = (set, setNumber, bias=null, isLastSet=false, isCollapsed=false) => ({
    type: 'title',
    key: set.setID+'title',
    setNumber: setNumber,
    exercise: set.exercise ? set.exercise.toLowerCase() : null,
    setID: set.setID,
    removed: false,
    isWorkingSet: isLastSet,
    bias: bias,
    isCollapsed: isCollapsed,
    videoFileURL: getVideoFileURL(set),
});

const createFormViewModel = (set, setNumber, isRemoved) => ({
    type: 'form',
    key: set.setID+'form',
    setID: set.setID,
    removed: isRemoved,
    setNumber: setNumber,
    tags: set.tags ? set.tags.map((tag) => tag.toLowerCase()) : [],
    weight: set.weight,
    metric: set.metric,
    rpe: set.rpe,
    videoFileURL: getVideoFileURL(set),
    videoType: set.videoType,
});

const createSummaryViewModel = (set) => {
    const numReps = SetUtils.numValidUnremovedReps(set);
    return {
        type: 'summary',
        key: set.setID+'summary',
        weight: set.weight ? set.weight : 0,
        numReps: numReps ? numReps : '0 reps',
        metric: set.metric,
        tags: set.tags ? set.tags.map((tag) => tag.toLowerCase()) : [],
    };
};

const createAnalysisViewModel = (set) => ({
    type: 'analysis',
    key: set.setID+'analysis',
    set: set,
});

const createRowViewModels = (set) => {
    let array = [];

    for (let i=0, repCount=0; i<set.reps.length; i++) {
        // get rep
        let rep = set.reps[i];

        // increment rep count
        repCount++;

        // obv1 properties
        let vm = {
            type: "data",
            rep: i,
            repDisplay: repCount,
            setID: set.setID,
            averageVelocity: "Invalid",
            peakVelocity: "Invalid",
            // peakVelocityLocation: "Invalid",
            linear3DAverageVelocity: "Invalid",
            rangeOfMotion: "Invalid",
            duration: "Invalid",
            removed: rep.removed,
            key: set.setID+i,
        };

        // update data if valid
        if (rep.isValid == true) {
            let avgVel = rep.averageVelocity;
            if (avgVel !== null) {
                vm.averageVelocity = avgVel / 1000;
            }

            let peakVel = rep.peakVelocity;
            if (peakVel !== null) {
                vm.peakVelocity = peakVel / 1000;
            }

            // let peakVelLoc = Math.round(rep.peakHeight / rep.rom * 100);
            // if (peakVelLoc !== null) {
            //     vm.peakVelocityLocation = peakVelLoc;
            // }

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

            // obv2 properties
            let duration = rep.duration; 
            if (duration !== null) {
                vm.duration = DurationCalculator.displayDuration(duration);
            } else {
                vm.duration = "-";
            }
        }

        //add obj
        array.splice(0, 0, vm); // insert at beginning
    }

    // return
    return array;
};

const createWorkingSetFooterVM = (set, restStartTime) => {
    let footerVM = {
        type: "working set footer",
        restStartTimeMS: (new Date(restStartTime)).getTime(),
        key: set.setID + 'live rest'
    };
    return footerVM;
};

const createRestVM = (set, lastSetEndTime, isCollapsed, isWorkingSet, setHasUnremovedRepWith3D) => {
    let rest = null;
    if (lastSetEndTime) {
        const restInMS = new Date(SetUtils.startTime(set)) - new Date(lastSetEndTime);
        rest = DateUtils.restInSentenceFormat(restInMS);
    }
    return {
        type: "rest",
        rest,
        key: set.setID + 'rest',
        isCollapsed: isCollapsed,
        isWorkingSet: isWorkingSet,
        show3D: isCollapsed && !isWorkingSet && setHasUnremovedRepWith3D,
    };
};

const createDeleteVM = (set) => ({
    type: "delete",
    setID: set.setID,
    key: set.setID + 'delete',
});

const createBottomBorder = (set) => ({
    type: "bottom border",
    key: set.setID + 'bottomborder',
});

const getWorkoutSections = createSelector(
    SetsSelectors.getWorkoutSets,
    WorkoutCollapsedSelectors.getCollapsedModel,
    ConnectedDeviceStatusSelectors.getCan3D,
    (sets, collapsedModel, can3D) => {
        return createViewModels(sets, collapsedModel, can3D);
    }
);

// worth memoizing because isUntouched ref check saves
const calculateIsAddEnabled = createSelector(
    SetsSelectors.getWorkoutSets,
    (sets) => {
        if (sets.length === 0) {
            return false;
        } else {
            return !SetUtils.isUntouched(sets[sets.length-1]);
        }
    }
);

const mapStateToProps = (state) => {
    return {
        sections: getWorkoutSections(state),
        sets: SetsSelectors.getWorkoutSets(state),
        isAddEnabled: calculateIsAddEnabled(state),
        isLoggedIn: AuthSelectors.getIsLoggedIn(state),
        isLoggingIn: AuthSelectors.getIsLoggingIn(state),
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        endSet: Actions.endSet,
        removeRep: Actions.removeRep,
        restoreRep: Actions.restoreRep,
        deleteSet: Actions.deleteSet,
        restoreSet: Actions.restoreSet,
        getDefaultMetric: SetsActionCreators.getDefaultMetric,
        tappedLoginBanner: Actions.tappedLoginBanner,
    }, dispatch);
};

const WorkoutScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkoutList);

export default WorkoutScreen;
