import {
    COLLAPSE_WORKOUT_SET,
    EXPAND_WORKOUT_SET,
    SHOW_VISUALIZATION_MODAL,
    SELECT_WORKOUT_REP_ROW,
    DESELECT_WORKOUT_REP_ROW,
} from 'app/configs+constants/ActionTypes';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as Analytics from 'app/services/Analytics';
import * as AuthActionCreators from 'app/redux/shared_actions/AuthActionCreators';
import * as WorkoutSelectors from 'app/redux/selectors/WorkoutSelectors';

export const tappedLoginBanner = () => (dispatch, getState) => {
    const state = getState();
    logLoginBannerAnalytics(state);

    dispatch(AuthActionCreators.requestLogin());
};

export const collapseSet = setID => (dispatch, getState) => {
    dispatch({
        type: COLLAPSE_WORKOUT_SET,
        setID: setID,
    });
};

export const expandSet = setID => (dispatch, getState) => {
    dispatch({
        type: EXPAND_WORKOUT_SET,
        setID: setID,
    });
};

export const deleteSet = setID => SetsActionCreators.deleteWorkoutSet(setID);

export const restoreSet = setID => SetsActionCreators.restoreWorkoutSet(setID);

export const removeRep = (setID, repIndex) =>
    SetsActionCreators.removeWorkoutRep(setID, repIndex);

export const restoreRep = (setID, repIndex) =>
    SetsActionCreators.restoreWorkoutRep(setID, repIndex);

export const endSet = () => {
    return SetsActionCreators.endSet(true, false);
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
            type: SELECT_WORKOUT_REP_ROW,
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
        type: DESELECT_WORKOUT_REP_ROW,
    });
};
// ANALYTICS

const logLoginBannerAnalytics = state => {
    Analytics.logEventWithAppState('workout_login_banner', {}, state);
};

const logSelectRowAnalytics = state => {
    const setID = WorkoutSelectors.getSelectedRowSetID(state);
    const isRepRemoved = WorkoutSelectors.getSelectedRowIsRemoved(state);
    const isWorkingSet = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState('workout_select_row', {
        is_removed: isRepRemoved,
        is_working_set: isWorkingSet,
    });
};

const logDeselectRowAnalytics = state => {
    const setID = WorkoutSelectors.getSelectedRowSetID(state);
    const isRepRemoved = WorkoutSelectors.getSelectedRowIsRemoved(state);
    const isWorkingSet = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState('workout_deselect_row', {
        is_removed: isRepRemoved,
        is_working_set: isWorkingSet,
    });
};
