import {
    LOADING_HISTORY,
    COLLAPSE_HISTORY_SET,
    EXPAND_HISTORY_SET,
    PRESENT_HISTORY_FILTER,
    SHOW_VISUALIZATION_MODAL,
    SELECT_WORKOUT_REP_ROW,
    DESELECT_WORKOUT_REP_ROW,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';

export const collapseSet = (setID) => (dispatch, getState) => {
    dispatch({
        type: COLLAPSE_HISTORY_SET,
        setID: setID,
    });
};

export const expandSet = (setID) => (dispatch, getState) => {
    dispatch({
        type: EXPAND_HISTORY_SET,
        setID: setID,
    });
};

export const deleteSet = (setID) => SetsActionCreators.deleteHistorySet(setID);

export const restoreSet = (setID) => SetsActionCreators.restoreHistorySet(setID);

export const finishLoading = () => ({
    type: LOADING_HISTORY,
    isLoading: false
});

export const removeRep = (setID, repIndex) => SetsActionCreators.removeHistoryRep(setID, repIndex);

export const restoreRep = (setID, repIndex) => SetsActionCreators.restoreHistoryRep(setID, repIndex);

export const presentHistoryFilter = () => {
    Analytics.setCurrentScreen('history_filters');

    return {
        type: PRESENT_HISTORY_FILTER,
    };
};

export const selectRow = (setID, rep, repDisplay) => (dispatch, getState) =>
    dispatch({
        type: SELECT_WORKOUT_REP_ROW,
        selectedRowSetID: setID,
        selectedRowRep: rep,
        selectedRowDisplayRep: repDisplay,
    });

export const deselectRow = () => (dispatch, getState) => {
    dispatch({
        type: DESELECT_WORKOUT_REP_ROW,
    });
};

export const open3D = setID => {
    Analytics.setCurrentScreen('3d_visualization');
    return {
        type: SHOW_VISUALIZATION_MODAL,
        setID,
    };
};
