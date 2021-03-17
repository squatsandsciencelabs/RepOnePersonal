// TODO: use selectors to cache things rather than doing the manual caching by hand that I do here

import { Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import * as Actions from './OneRMEditSetActions';
import OneRMEditSetView from './OneRMEditSetView';

import * as CollapsedMetrics from 'app/math/CollapsedMetrics';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as AnalysisSelectors from 'app/redux/selectors/AnalysisSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as SettingsSelectors from 'app/redux/selectors/SettingsSelectors';
import * as DateUtils from 'app/utility/DateUtils';
import * as SetUtils from 'app/utility/SetUtils';

// assumes chronological sets
const createViewModels = (sets, setID, columnsModel, metric) => {
    // declare variables
    let sections = []; // the return value
    let section = null; // contains the actual data
    let lastExerciseName = null; // to help calculate set numbers
    let setNumber = 1; // set number to display
    let workoutStartTime = null; // to help calculate rest time and display section header
    let lastSetEndTime = null; // to help calculate rest time
    let isInitialSet = false; // to help determine when to display rest time
    let isRemoved = false;
    let title = '';
    
    // ignore if initialStartTime is null as that was a bug, it's supposed to be undefined or an actual date
    sets = sets.filter((set) => set.initialStartTime !== null);

    // build view models
    for (let i=0; i<sets.length; i++) {
        // get set
        let set = sets[i];
        let rpe = String(sets[i].rpe);

        // ignore deleted set
        if (set.setID !== setID && SetUtils.isDeleted(set)) {
            continue;
        }

        // setup based on first actual set
        if (!workoutStartTime) {
            workoutStartTime = SetUtils.startTime(set);
            section = { key: new Date(workoutStartTime).toLocaleString(), data: [], position: 0 };
            sections.push(section);
            isInitialSet = true;
        } else {
            isInitialSet = false;
        }

        // set num and last exercise
        isRemoved = SetUtils.isDeleted(set);
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
        lastExerciseName = set.exercise;

        // model for actual set
        if (set.setID === setID) {
            // title
            title = SetUtils.markerDisplayValue(set, metric);

            // set card data
            let array = [0, 0];

            // rpe null check
            if (set.rpe) {
                set.rpe = String(set.rpe);
            } else {
                set.rpe = "";
            }

            // card views
            if (!isRemoved) {
                array.push(createTitleViewModel(set, setNumber));
                array.push(createFormViewModel(set, setNumber));
                array.push(createAnalysisViewModel(set));
                if (SetUtils.hasUnremovedRepWith3D(set)) {
                    array.push(createOpen3DButton(set));
                } else {
                    array.push(createBorder(set));
                }
                if (set.reps.length > 0) {
                    array.push(createSubheaderModel(set, columnsModel));
                }
                Array.prototype.push.apply(array, createRowViewModels(set, columnsModel));
                array.push(createFooterVM(set, !isInitialSet && SetUtils.hasUnremovedRep(set) && lastSetEndTime != null ? lastSetEndTime : null));
            } else {
                array.push(createRestoreViewModel(set));
            }

            // add and return
            Array.prototype.splice.apply(section.data, array);
            return { title: title, sections: sections };
        }

        // last set end time
        if (isInitialSet) {
            // new set, reset the end time
            lastSetEndTime = isRemoved ? null : SetUtils.endTime(set);
        } else if (SetUtils.hasUnremovedRep(set)) { // ignore removed sets in rest calculations
            // update variable for calculation purposes
            lastSetEndTime = SetUtils.endTime(set);
        }
    }

    // cannot find the set in question, should be impossible
    // TODO: error this
    return {title: title, sections: null};
}

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

const createTitleViewModel = (set, setNumber) => ({
    type: 'title',
    key: set.setID+'title',
    setNumber: setNumber,
    exercise: set.exercise ? set.exercise.toLowerCase() : null,
    setID: set.setID,
    isCollapsed: false,
    removed: false,
    videoFileURL: getVideoFileURL(set),
});

const createFormViewModel = (set, setNumber) => ({
    type: 'form',
    key: set.setID+'form',
    setID: set.setID,
    initialStartTime: set.initialStartTime,
    removed: false,
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

const createRowViewModels = (set, columnsModel) => {
    let array = [];

    for (let i=0, repCount=0; i<set.reps.length; i++) {
        // get rep
        let rep = set.reps[i];

        // increment rep count
        repCount++;

        let vm = {
            type: "data",
            rep: i,
            repDisplay: repCount,
            setID: set.setID,
            removed: rep.removed,
            key: set.setID+i,
        };

        // update vm
        vm.columns = columnsModel.map(m => SetUtils.getDisplayMetric(m, rep, set));

        // add obj
        array.push(vm);
    }

    // return
    return array;
};

const createFooterVM = (set, lastSetEndTime) => {
    let rest = null;
    if (lastSetEndTime) {
        const restInMS = new Date(SetUtils.startTime(set)) - new Date(lastSetEndTime);
        rest = DateUtils.restInSentenceFormat(restInMS);
    }
    let restVM = {
        type: "footer",
        rest,
        setID: set.setID,
        key: set.setID + 'rest',
        isCollapsed: false,
        show3D: false,
    };
    return restVM;
};

// workout sets

const getAnalysisWorkoutSetsChronological = (sets, workoutID) => {
    let analysisSets = sets.filter((set) => set.workoutID === workoutID);
    analysisSets.sort((set1, set2) => {
        let set1Start = SetUtils.startTime(set1);
        if (set1Start !== null) {
            set1Start = Date.parse(set1Start);
        }

        let set2Start = SetUtils.startTime(set2);
        if (set2Start !== null) {
            set2Start = Date.parse(set2Start);
        }

        return set1Start - set2Start;
    });
    return analysisSets;
};

// map state

const selectMapStateToProps = createSelector(
    AnalysisSelectors.getSetID,
    AnalysisSelectors.getWorkoutID,
    SetsSelectors.getAllSets,
    ColumnsSettingsSelectors.getMetrics,
    SettingsSelectors.getDefaultMetric,
    (setID, workoutID, allSets, columnsModel, defaultMetric) => {
        if (setID) {
            const sets = getAnalysisWorkoutSetsChronological(allSets, workoutID);
            const {title, sections} = createViewModels(sets, setID, columnsModel, defaultMetric);

            return {
                title: title,
                setID,
                sections: sections,
                isModalShowing: true,
            };
        } else {
            return {
                title: '',
                setID: null,
                sections: [],
                isModalShowing: false,
            };
        }
    }
);

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        deleteSet: Actions.deleteSet,
        restoreSet: Actions.restoreSet,
        removeRep: Actions.removeRep,
        restoreRep: Actions.restoreRep,
        open3D: Actions.open3D,
        dismissModal: Actions.dismissEditSet,
    }, dispatch);
};

const OneRMEditSetScreen = connect(
    selectMapStateToProps,
    mapDispatchToProps
)(OneRMEditSetView);

export default OneRMEditSetScreen;
