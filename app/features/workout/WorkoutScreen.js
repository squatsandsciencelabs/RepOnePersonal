import { Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import * as CollapsedMetrics from 'app/math/CollapsedMetrics';

import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as DateUtils from 'app/utility/DateUtils';
import * as SetUtils from 'app/utility/SetUtils';
import WorkoutList from './WorkoutList';
import * as Actions from './WorkoutActions';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as WorkoutCollapsedSelectors from 'app/redux/selectors/WorkoutCollapsedSelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as AuthSelectors from 'app/redux/selectors/AuthSelectors';

// assumes chronological sets
const createViewModels = (
    sets,
    collapsedModel,
    columnsModel,
    labels,
    units,
    can3D,
) => {
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
    sets.map(set => {
        // last section check, splitting the "current set" out for footer purposes
        // TODO: depending on design for "finish current set", can put all the data in one section instead
        if (count === sets.length - 1) {
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
            if (
                lastExerciseName !== null &&
                lastExerciseName === set.exercise
            ) {
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
            array.push(
                createTitleViewModel(
                    set,
                    setNumber,
                    lastExerciseName,
                    isLastSet,
                    isCollapsed,
                ),
            );
            if (!isCollapsed) {
                array.push(createFormViewModel(set, setNumber, isRemoved));
                if (!isRemoved) {
                    array.push(createAnalysisViewModel(set));
                }
                if (isLastSet || set.reps.length > 0) {
                    if (
                        OpenBarbellConfig.visualizationEnabled &&
                        ((isLastSet && can3D) || setHasUnremovedRepWith3D)
                    ) {
                        array.push(createOpen3DButton(set));
                    } else {
                        array.push(createBorder(set));
                    }
                    array.push(createSubheaderModel(set, labels, units));
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
            Array.prototype.push.apply(
                array,
                createRowViewModels(set, columnsModel),
            );
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
                    array.push(
                        createFooterVM(
                            set,
                            isInitialSet ? null : lastSetEndTime,
                            isCollapsed,
                            isLastSet,
                            setHasUnremovedRepWith3D,
                        ),
                    );
                }
            }
        } else if (
            !isRemoved &&
            (!isCollapsed ||
                (!isInitialSet && lastSetEndTime !== null) ||
                setHasUnremovedRepWith3D)
        ) {
            hasFooter = true;
            array.push(
                createFooterVM(
                    set,
                    isInitialSet ? null : lastSetEndTime,
                    isCollapsed,
                    isLastSet,
                    setHasUnremovedRepWith3D,
                ),
            );
        }
        if (!isInitialSet && !isRemoved && SetUtils.hasUnremovedRep(set)) {
            // ignore removed sets in rest calculations
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
};

const createTopBorder = set => ({
    type: 'top border',
    key: set.setID + 'topborder',
});

const createWorkingSetHeader = set => ({
    type: 'working set header',
    key: set.setID + 'end set timer',
});

const createRestoreViewModel = set => {
    const numReps = SetUtils.numValidUnremovedReps(set);
    return {
        type: 'restore',
        setID: set.setID,
        exercise: set.exercise ? set.exercise.toLowerCase() : null,
        weight: set.weight ? set.weight : 0,
        rpe: set.rpe ? set.rpe : 0,
        numReps: numReps ? numReps : '0 reps',
        metric: set.metric,
        tags: set.tags ? set.tags.map(tag => tag.toLowerCase()) : [],
        key: set.setID + 'restore',
    };
};

// TODO: remove hack fix, see https://github.com/react-native-community/react-native-video/issues/1572
const getVideoFileURL = set => {
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

const createTitleViewModel = (
    set,
    setNumber,
    bias = null,
    isLastSet = false,
    isCollapsed = false,
) => ({
    type: 'title',
    key: set.setID + 'title',
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
    key: set.setID + 'form',
    setID: set.setID,
    removed: isRemoved,
    setNumber: setNumber,
    tags: set.tags ? set.tags.map(tag => tag.toLowerCase()) : [],
    weight: set.weight,
    metric: set.metric,
    rpe: set.rpe,
    videoFileURL: getVideoFileURL(set),
    videoType: set.videoType,
    kratosDiscs: set.kratosDiscs,
    deviceType: set.deviceType,
});

const createSummaryViewModel = set => {
    const numReps = SetUtils.numValidUnremovedReps(set);
    return {
        type: 'summary',
        key: set.setID + 'summary',
        weight: set.weight ? set.weight : 0,
        numReps: numReps ? numReps : '0 reps',
        metric: set.metric,
        tags: set.tags ? set.tags.map(tag => tag.toLowerCase()) : [],
        kratosDiscs: set.kratosDiscs,
        deviceType: set.deviceType,
    };
};

const createAnalysisViewModel = set => ({
    type: 'analysis',
    key: set.setID + 'analysis',
    set: set,
});

const createOpen3DButton = set => ({
    type: 'open 3d button',
    setID: set.setID,
    key: set.setID + 'open 3d button',
});

const createBorder = set => ({
    type: 'border',
    key: `${set.setID}border`,
});

const createSubheaderModel = (set, labels, units) => ({
    type: 'subheader',
    key: set.setID + 'subheader',
    labels,
    units,
});

const createRowViewModels = (set, columnsModel) => {
    let array = [];

    for (let i = 0, repCount = 0; i < set.reps.length; i++) {
        // get rep
        let rep = set.reps[i];

        // increment rep count
        repCount++;

        // vm
        let vm = {
            type: 'data',
            rep: i,
            repDisplay: repCount,
            setID: set.setID,
            removed: rep.removed,
            key: set.setID + i,
        };

        if (rep.deviceFamily === 'Kratos') {
            const resultReps = SetUtils.getKratosRepRows(rep);

            vm.columns = Object.entries(resultReps).map(([key, value]) => {
                const model = columnsModel.map(m =>
                    SetUtils.getKratosDisplayMetric(m, value, set),
                );
                // last element of the array is rowType - eccentric || concentric
                model.push(key);
                return model;
            });

            // add obj
            array.splice(0, 0, vm); // insert at beginning
        } else {
            // update vm
            vm.columns = columnsModel.map(m =>
                SetUtils.getDisplayMetric(m, rep, set),
            );

            // add obj
            array.splice(0, 0, vm); // insert at beginning
        }
    }
    return array;
};

const createWorkingSetFooterVM = (set, restStartTime) => {
    let footerVM = {
        type: 'working set footer',
        restStartTimeMS: new Date(restStartTime).getTime(),
        key: set.setID + 'live rest',
    };
    return footerVM;
};

const createFooterVM = (
    set,
    lastSetEndTime,
    isCollapsed,
    isWorkingSet,
    setHasUnremovedRepWith3D,
) => {
    let rest = null;
    if (lastSetEndTime) {
        const restInMS =
            new Date(SetUtils.startTime(set)) - new Date(lastSetEndTime);
        rest = DateUtils.restInSentenceFormat(restInMS);
    }
    return {
        type: 'footer',
        rest,
        key: set.setID + 'rest',
        setID: set.setID,
        isCollapsed: isCollapsed,
        isWorkingSet: isWorkingSet,
        show3D:
            OpenBarbellConfig.visualizationEnabled &&
            isCollapsed &&
            !isWorkingSet &&
            setHasUnremovedRepWith3D,
    };
};

const createBottomBorder = (set, isPadded) => ({
    type: 'bottom border',
    key: set.setID + 'bottomborder',
    isPadded,
});

const getWorkoutSections = createSelector(
    SetsSelectors.getWorkoutSets,
    WorkoutCollapsedSelectors.getCollapsedModel,
    ColumnsSettingsSelectors.getMetrics,
    ColumnsSettingsSelectors.getColumnLabels,
    ColumnsSettingsSelectors.getColumnUnits,
    ConnectedDeviceStatusSelectors.getCan3D,
    (sets, collapsedModel, columnsModel, labels, units, can3D) => {
        return createViewModels(
            sets,
            collapsedModel,
            columnsModel,
            labels,
            units,
            can3D,
        );
    },
);

// worth memoizing because isUntouched ref check saves
const calculateIsAddEnabled = createSelector(
    SetsSelectors.getWorkoutSets,
    sets => {
        if (sets.length === 0) {
            return false;
        } else {
            return !SetUtils.isUntouched(sets[sets.length - 1]);
        }
    },
);

const mapStateToProps = state => {
    return {
        sections: getWorkoutSections(state),
        sets: SetsSelectors.getWorkoutSets(state),
        isAddEnabled: calculateIsAddEnabled(state),
        isLoggedIn: AuthSelectors.getIsLoggedIn(state),
        isLoggingIn: AuthSelectors.getIsLoggingIn(state),
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            endSet: Actions.endSet,
            removeRep: Actions.removeRep,
            restoreRep: Actions.restoreRep,
            deleteSet: Actions.deleteSet,
            restoreSet: Actions.restoreSet,
            getDefaultMetric: SetsActionCreators.getDefaultMetric,
            open3D: Actions.open3D,
            tappedLoginBanner: Actions.tappedLoginBanner,
        },
        dispatch,
    );
};

const WorkoutScreen = connect(mapStateToProps, mapDispatchToProps)(WorkoutList);

export default WorkoutScreen;
