import { Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

import * as CollapsedMetrics from 'app/math/CollapsedMetrics';

import * as AuthSelectors from 'app/redux/selectors/AuthSelectors';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as DateUtils from 'app/utility/DateUtils';
import * as SetUtils from 'app/utility/SetUtils';
import * as Actions from './HistoryActions';
import HistoryList from './HistoryList';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as HistoryCollapsedSelectors from 'app/redux/selectors/HistoryCollapsedSelectors';
import * as KratosColumnsSettingsSelectors from 'app/redux/selectors/KratosColumnsSettingsSelectors';

// assumes chronological sets
const createViewModels = (
    sets,
    collapsedModel,
    columnsModel,
    columnLabels,
    columnUnits,
    shouldShowRemoved,
    kratosColumnsModel,
    kratosColumnLabels,
    kratosColumnUnits,
) => {
    // declare variables
    let sections = []; // the return value
    let section = null; // contains the actual data
    let lastWorkoutID = null; // to help calculate sections
    let lastExerciseName = null; // to help calculate set numbers
    let setNumber = 1; // set number to display
    let workoutStartTime = null; // to help calculate rest time and display section header
    let lastSetEndTime = null; // to help calculate rest time
    let isInitialSet = false; // to help determine when to display rest time
    let isCollapsed = false;
    let isRemoved = false;

    // build view models
    for (let i = 0; i < sets.length; i++) {
        // get set
        let set = sets[i];

        // ignore if initialStartTime is null as that was a bug, it's supposed to be undefined or an actual date
        if (set.initialStartTime === null) {
            continue;
        }

        // rpe
        let rpe = String(sets[i].rpe);
        if (set.rpe) {
            set.rpe = rpe;
        } else {
            set.rpe = '';
        }

        // every workout is a section
        if (lastWorkoutID !== set.workoutID) {
            // set vars
            lastWorkoutID = set.workoutID;
            workoutStartTime = SetUtils.startTime(set);
            isInitialSet = true;

            // create section
            section = {
                key: new Date(workoutStartTime).toLocaleString(),
                data: [],
                position: -1,
            };
            sections.splice(0, 0, section); // insert at beginning
        } else {
            isInitialSet = false;
        }

        // set card data
        let array = [0, 0];

        // set state booleans
        isCollapsed = collapsedModel[set.setID] !== false; // TODO: make this cleaner, old method was isCollapsed = HistoryCollapsedSelectors.getIsCollapsed(state, set.setID)
        isRemoved = SetUtils.isDeleted(set);

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
        const setHasUnremovedRepWith3D = SetUtils.hasUnremovedRepWith3D(set);
        if (!isRemoved) {
            array.push(createTitleViewModel(set, setNumber, isCollapsed));
            if (!isCollapsed) {
                array.push(createFormViewModel(set, setNumber, isRemoved));
                if (!isRemoved) {
                    array.push(createAnalysisViewModel(set));
                }
                if (
                    (shouldShowRemoved && !SetUtils.hasNoReps(set)) ||
                    (!shouldShowRemoved &&
                        SetUtils.numValidUnremovedReps(set) > 0)
                ) {
                    // TODO: might have bug where set has just 1 invalid rep?
                    if (
                        OpenBarbellConfig.visualizationEnabled &&
                        setHasUnremovedRepWith3D
                    ) {
                        array.push(createOpen3DButton(set));
                    } else {
                        array.push(createBorder(set));
                    }
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
            const data = createRowViewModels(
                set,
                columnsModel,
                shouldShowRemoved,
                kratosColumnsModel,
            );
            const subheader =
                set.deviceType === 'Kratos'
                    ? createSubheaderModel(
                          set,
                          kratosColumnLabels,
                          kratosColumnUnits,
                      )
                    : createSubheaderModel(set, columnLabels, columnUnits);

            array.push({
                type: 'reps',
                key: `${set.setID}reps`,
                setID: set.setID,
                data,
                subheader,
                repsAreChronological: true,
                deviceType: set.deviceType,
            });
        }

        // footer with rest, 3d, and delete
        if (isInitialSet) {
            // new set, reset the end time
            lastSetEndTime = isRemoved ? null : SetUtils.endTime(set);
        }
        let hasFooter = false;
        if (
            !isRemoved &&
            (!isCollapsed ||
                (!isInitialSet && lastSetEndTime !== null) ||
                setHasUnremovedRepWith3D)
        ) {
            // add rest footer if valid
            // ALWAYS shows up when expanded regardless of rest, as it needs to have delete
            // on collapsed, it only shows up if REST or if has 3D
            hasFooter = true;
            array.push(
                createFooterVM(
                    set,
                    isInitialSet ? null : lastSetEndTime,
                    isCollapsed,
                    setHasUnremovedRepWith3D,
                ),
            );
        }
        if (!isInitialSet && !isRemoved && SetUtils.hasUnremovedRep(set)) {
            // ignore removed sets in rest calculations
            // update end time for calculation purposes
            lastSetEndTime = SetUtils.endTime(set);
        }

        // bottom border
        if (!hasFooter) {
            array.push(createBottomBorder(set, !isRemoved));
        }

        // insert set card data
        Array.prototype.splice.apply(section.data, array);
    }

    // add positions
    for (var i = 0; i < sections.length; i++) {
        sections[i].position = i;
    }

    // return
    return sections;
};

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

const createTitleViewModel = (set, setNumber, isCollapsed = false) => ({
    type: 'title',
    key: set.setID + 'title',
    setNumber: setNumber,
    exercise: set.exercise ? set.exercise.toLowerCase() : null,
    setID: set.setID,
    isCollapsed: isCollapsed,
    removed: false,
    videoFileURL: getVideoFileURL(set),
});

const createFormViewModel = (set, setNumber, isRemoved) => ({
    type: 'form',
    key: set.setID + 'form',
    setID: set.setID,
    initialStartTime: set.initialStartTime,
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

const createRowViewModels = (
    set,
    columnsModel,
    shouldShowRemoved,
    kratosColumnsModel,
) => {
    let array = [];

    for (let i = 0, repCount = 0; i < set.reps.length; i++) {
        // get rep
        let rep = set.reps[i];

        // ignore deleted rows if necessary
        if (shouldShowRemoved === false && rep.removed === true) {
            continue;
        }

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
            isLast: repCount === set.reps.length,
        };

        if (rep.deviceFamily === 'Kratos') {
            const resultReps = SetUtils.getKratosRepRows(rep);
            vm.columns = Object.entries(resultReps).map(([key, value]) => {
                const model = kratosColumnsModel.map(m =>
                    SetUtils.getKratosDisplayMetric(m, value, set),
                );
                // last element of the array is rowType - eccentric || concentric
                model.push(key);
                return model;
            });

            // add obj
            array.push(vm);
        } else {
            // update vm
            vm.columns = columnsModel.map(m =>
                SetUtils.getDisplayMetric(m, rep, set),
            );

            // add obj
            array.push(vm);
        }
    }

    // return
    return array;
};

const createFooterVM = (set, lastSetEndTime, isCollapsed, setHasRepWith3D) => {
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
        show3D:
            OpenBarbellConfig.visualizationEnabled &&
            isCollapsed &&
            setHasRepWith3D,
    };
};

const createBottomBorder = (set, isPadded) => ({
    type: 'bottom border',
    key: set.setID + 'bottomborder',
    isPadded,
});

const getHistorySections = createSelector(
    SetsSelectors.getFilteredHistorySets,
    HistoryCollapsedSelectors.getCollapsedModel,
    ColumnsSettingsSelectors.getMetrics,
    ColumnsSettingsSelectors.getColumnLabels,
    ColumnsSettingsSelectors.getColumnUnits,
    HistorySelectors.getShowRemoved,
    KratosColumnsSettingsSelectors.getMetrics,
    KratosColumnsSettingsSelectors.getColumnLabels,
    KratosColumnsSettingsSelectors.getColumnUnits,
    (
        sets,
        collapsedModel,
        columnsModel,
        columnLabels,
        columnUnits,
        shouldShowRemoved,
        kratosColumnsModel,
        kratosColumnLabels,
        kratosColumnUnits,
    ) => {
        return createViewModels(
            sets,
            collapsedModel,
            columnsModel,
            columnLabels,
            columnUnits,
            shouldShowRemoved,
            kratosColumnsModel,
            kratosColumnLabels,
            kratosColumnUnits,
        );
    },
);

const mapStateToProps = state => {
    const email = AuthSelectors.getEmail(state);
    const shouldShowRemoved = HistorySelectors.getShowRemoved(state);
    const isFiltering = HistorySelectors.getIsFiltering(state);
    const sections = getHistorySections(state);
    const selectedRowSetID = HistorySelectors.getSelectedRowSetID(state);
    const selectedRowRep = HistorySelectors.getSelectedRowRep(state);
    const selectedRowDisplayRep =
        HistorySelectors.getSelectedRowDisplayRep(state);
    const selectedRowIsRemoved =
        HistorySelectors.getSelectedRowIsRemoved(state);
    const selectedRowOverlayNumbers =
        HistorySelectors.getSelectedRowOverlayNumbers(state);

    return {
        email,
        sections,
        shouldShowRemoved,
        isFiltering,
        selectedRowSetID,
        selectedRowRep,
        selectedRowDisplayRep,
        selectedRowIsRemoved,
        selectedRowOverlayNumbers,
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            removeRep: Actions.removeRep,
            restoreRep: Actions.restoreRep,
            deleteSet: Actions.deleteSet,
            restoreSet: Actions.restoreSet,
            open3D: Actions.open3D,
            finishLoading: Actions.finishLoading,
            presentHistoryFilter: Actions.presentHistoryFilter,
            selectRow: Actions.selectRow,
            deselectRow: Actions.deselectRow,
        },
        dispatch,
    );
};

const HistoryScreen = connect(mapStateToProps, mapDispatchToProps)(HistoryList);

export default withSafeAreaInsets(HistoryScreen);
