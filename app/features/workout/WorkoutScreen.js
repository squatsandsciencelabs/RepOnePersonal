import { Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
    AVG_VELOCITY_METRIC,
    PKV_METRIC,
    PKH_METRIC,
    ROM_METRIC,
    DURATION_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';

import { createSelector } from 'reselect';

import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as DateUtils from 'app/utility/DateUtils';
import * as SetUtils from 'app/utility/SetUtils';
import * as DurationCalculator from 'app/utility/DurationCalculator'
import WorkoutList from './WorkoutList';
import * as Actions from './WorkoutActions';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as WorkoutCollapsedSelectors from 'app/redux/selectors/WorkoutCollapsedSelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as AuthSelectors from 'app/redux/selectors/AuthSelectors';

// assumes chronological sets
const createViewModels = (sets, columnsModel, collapsedModel, can3D) => {
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
            array.push(createWorkingSetHeader(set));
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
                        array.push(createOpen3DButton(set));
                    } else {
                        array.push(createBorder(set));
                    }
                    array.push(createSubheaderModel(set, columnsModel));
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
            Array.prototype.push.apply(array, createRowViewModels(set, columnsModel));
        }

        // footer with rest, 3d, and delete
        if (isInitialSet) {
            // new set, reset the end time
            lastSetEndTime = isRemoved ? null : SetUtils.endTime(set);
        }
        let hasFooter = false;
        if (isLastSet) {
            if (lastSetEndTime !== null) {
                if (set.reps.length === 0) {
                    // working set, live rest mode
                    array.push(createWorkingSetFooterVM(set, lastSetEndTime));
                } else {
                    // working set, normal rest time (not live)
                    hasFooter = true;
                    array.push(createFooterVM(set, isInitialSet ? null : lastSetEndTime, isCollapsed, isLastSet, setHasUnremovedRepWith3D));
                }
            }
        } else if (!isRemoved && (!isCollapsed || (!isInitialSet && lastSetEndTime !== null) || setHasUnremovedRepWith3D)) {
            hasFooter = true;
            array.push(createFooterVM(set, isInitialSet ? null : lastSetEndTime, isCollapsed, isLastSet, setHasUnremovedRepWith3D));
        }
        if (!isInitialSet && !isRemoved && SetUtils.hasUnremovedRep(set)) { // ignore removed sets in rest calculations
            // update variable for calculation purposes
            lastSetEndTime = SetUtils.endTime(set);
        }

        // bottom border
        if (isLastSet) {
            if (lastSetEndTime === null || set.reps.length > 0) {
                // if no working set footer vm, add bottom border. no need if working set footer with live rest is visible
                array.push(createBottomBorder(set, false));
            }
        } else if (!hasFooter) {
            array.push(createBottomBorder(set, !isRemoved));
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

const createWorkingSetHeader = (set) => ({
    type: 'working set header',
    key: set.setID+'end set timer'
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

const createOpen3DButton = (set) => ({
    type: 'open 3d button',
    setID: set.setID,
    key: set.setID+"open 3d button",
});

const createBorder = (set) => ({
    type: "border",
    key: `${set.setID}border`,
});

const createSubheaderModel = (set, columnsModel) => ({
    type: "subheader",
    key: set.setID+"subheader",
    labels: columnsModel.map(metric => CollapsedMetrics.metricAbbreviation(metric)),
    units: columnsModel.map(metric => CollapsedMetrics.metricUnit(metric)),
});

const createRowViewModels = (set) => {
    let array = [];

    for (let i=0, repCount=0; i<set.reps.length; i++) {
        // get rep
        let rep = set.reps[i];

        // increment rep count
        repCount++;

        // helpers
        const helper = {
            AVG_VELOCITY_METRIC: "INV",
            PKV_METRIC: "INV",
            PKH_METRIC: "INV",
            // linear3DAverageVelocity: "INV",
            ROM_METRIC: "INV",
            DURATION_METRIC: "INV",
        };

        // vm
        let vm = {
            type: "data",
            rep: i,
            repDisplay: repCount,
            setID: set.setID,
            removed: rep.removed,
            key: set.setID+i,
        };

        // update data if valid
        if (rep.isValid == true) {
            let avgVel = rep.averageVelocity;
            if (avgVel !== null) {
                helper.AVG_VELOCITY_METRIC = avgVel / 1000;
            }

            let peakVel = rep.peakVelocity;
            if (peakVel !== null) {
                helper.PKV_METRIC = peakVel / 1000;
            }

            let peakVelLoc = Math.round(rep.peakHeight / rep.rom * 100);
            if (peakVelLoc !== null) {
                helper.PKH_METRIC = peakVelLoc;
            }

            // if (rep.linear3DAverageVelocity !== null && rep.linear3DAverageVelocity !== undefined) {
            //     helper.linear3DAverageVelocity = rep.linear3DAverageVelocity / 1000;
            // }

            let rom = rep.rom;
            if (rom !== null) {
                helper.ROM_METRIC = rom;
            }

            // if (rep.linear3DROM !== null && rep.linear3DROM !== undefined) {
            //     helper.linear3DROM = rep.linear3DROM;
            // }

            // obv2 properties
            let duration = rep.duration;
            if (duration !== null) {
                helper.DURATION_METRIC = DurationCalculator.displayDuration(duration);
            } else {
                helper.DURATION_METRIC = "-";
            }
        }

        // update vm
        vm.columns = columnsModel.map(m => helper[m]);

        // add obj
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

const createFooterVM = (set, lastSetEndTime, isCollapsed, isWorkingSet, setHasUnremovedRepWith3D) => {
    let rest = null;
    if (lastSetEndTime) {
        const restInMS = new Date(SetUtils.startTime(set)) - new Date(lastSetEndTime);
        rest = DateUtils.restInSentenceFormat(restInMS);
    }
    return {
        type: "footer",
        rest,
        key: set.setID + 'rest',
        setID: set.setID,
        isCollapsed: isCollapsed,
        isWorkingSet: isWorkingSet,
        show3D: isCollapsed && !isWorkingSet && setHasUnremovedRepWith3D,
    };
};

const createBottomBorder = (set, isPadded) => ({
    type: "bottom border",
    key: set.setID + 'bottomborder',
    isPadded,
});

const getWorkoutSections = createSelector(
    SetsSelectors.getWorkoutSets,
    ColumnsSettingsSelectors.getMetrics,
    WorkoutCollapsedSelectors.getCollapsedModel,
    ConnectedDeviceStatusSelectors.getCan3D,
    (sets, columnsModel, collapsedModel, can3D) => {
        return createViewModels(sets, columnsModel, collapsedModel, can3D);
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
        open3D: Actions.open3D,
        tappedLoginBanner: Actions.tappedLoginBanner,
    }, dispatch);
};

const WorkoutScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkoutList);

export default WorkoutScreen;
