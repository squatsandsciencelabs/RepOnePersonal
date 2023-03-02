import {
    DISMISS_EDIT_1RM_SET,
    SHOW_VISUALIZATION_MODAL,
    SELECT_1RM_REP_ROW,
    DESELECT_1RM_REP_ROW,
} from 'app/configs+constants/ActionTypes';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';
import * as Analytics from 'app/services/Analytics';
import * as AnalysisSelectors from 'app/redux/selectors/AnalysisSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

export const deleteSet = setID => (dispatch, getState) => {
    const state = getState();
    if (SetsSelectors.getIsWorkoutSet(state, setID)) {
        dispatch(SetsActionCreators.deleteWorkoutSet(setID));
    } else {
        dispatch(SetsActionCreators.deleteHistorySet(setID));
    }
};

export const restoreSet = setID => (dispatch, getState) => {
    const state = getState();
    if (SetsSelectors.getIsWorkoutSet(state, setID)) {
        dispatch(SetsActionCreators.restoreWorkoutSet(setID));
    } else {
        dispatch(SetsActionCreators.restoreHistorySet(setID));
    }
};

export const removeRep = (setID, repIndex) => (dispatch, getState) => {
    const state = getState();
    if (SetsSelectors.getIsWorkoutSet(state, setID)) {
        dispatch(SetsActionCreators.removeWorkoutRep(setID, repIndex));
    } else {
        dispatch(SetsActionCreators.removeHistoryRep(setID, repIndex));
    }
};

export const restoreRep = (setID, repIndex) => (dispatch, getState) => {
    const state = getState();
    if (SetsSelectors.getIsWorkoutSet(state, setID)) {
        dispatch(SetsActionCreators.restoreWorkoutRep(setID, repIndex));
    } else {
        dispatch(SetsActionCreators.restoreHistoryRep(setID, repIndex));
    }
};

export const dismissEditSet = () => (dispatch, getState) => {
    const state = getState();
    logCloseEditSetAnalytics(state);
    Analytics.setCurrentScreen('analysis');

    dispatch({
        type: DISMISS_EDIT_1RM_SET,
    });
};

export const open3D = setID => {
    Analytics.setCurrentScreen('3d_visualization');
    return {
        type: SHOW_VISUALIZATION_MODAL,
        setID,
    };
};

export const selectRow =
    (setID, rep, repDisplay, overlayNumbers, isRemoved) =>
    (dispatch, getState) => {
        const state = getState();
        logSelectRowAnalytics(state);

        dispatch({
            type: SELECT_1RM_REP_ROW,
            selectedRowSetID: setID,
            selectedRowRep: rep,
            selectedRowDisplayRep: repDisplay,
            selectedRowOverlayNumbers: overlayNumbers,
            selectedRowIsRemoved: isRemoved,
        });
    };

export const deselectRow = () => (dispatch, getState) => {
    const state = getState();
    logDeselectRowAnalytics(state);

    dispatch({
        type: DESELECT_1RM_REP_ROW,
    });
};

// ANALYTICS

const logCloseEditSetAnalytics = state => {
    const setID = AnalysisSelectors.getSetID(state);
    const set = SetsSelectors.getSet(state, setID);

    const didChangeExercise = AnalysisSelectors.getDidUpdateExerciseName(
        state,
        set,
    );
    const didChangeWeight = AnalysisSelectors.getDidUpdateWeight(state, set);
    const didChangeMetric = AnalysisSelectors.getDidUpdateMetric(state, set);
    const didChangeRPE = AnalysisSelectors.getDidUpdateRPE(state, set);
    const didChangeTags = AnalysisSelectors.getDidUpdateTags(state, set);
    const didChangeReps = AnalysisSelectors.getDidUpdateReps(state, set);
    const didDeleteSet = AnalysisSelectors.getDidDeleteSet(state, set);
    const didRestoreSet = AnalysisSelectors.getDidRestoreSet(state, set);
    const wasError = AnalysisSelectors.getWasError(state);

    const didEditSet =
        didChangeExercise ||
        didChangeWeight ||
        didChangeMetric ||
        didChangeRPE ||
        didChangeTags ||
        didChangeReps ||
        didDeleteSet ||
        didRestoreSet;

    Analytics.logEventWithAppState(
        'one_rm_close_edit_set',
        {
            did_edit_set: didEditSet,
            did_change_exercise: didChangeExercise,
            did_change_weight: didChangeWeight,
            did_change_metric: didChangeMetric,
            did_change_rpe: didChangeRPE,
            did_change_tags: didChangeTags,
            did_change_reps: didChangeReps,
            did_delete_set: didDeleteSet,
            did_restore_set: didRestoreSet,
            was_error: wasError,
        },
        state,
    );
};

const logSelectRowAnalytics = state => {
    const setID = AnalysisSelectors.getSelectedRowSetID(state);
    const isRepRemoved = AnalysisSelectors.getSelectedRowIsRemoved(state);
    const isWorkingSet = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState('one_rm_select_row', {
        is_removed: isRepRemoved,
        is_working_set: isWorkingSet,
    });
};

const logDeselectRowAnalytics = state => {
    const setID = AnalysisSelectors.getSelectedRowSetID(state);
    const isRepRemoved = AnalysisSelectors.getSelectedRowIsRemoved(state);
    const isWorkingSet = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState('one_rm_deselect_row', {
        is_removed: isRepRemoved,
        is_working_set: isWorkingSet,
    });
};
