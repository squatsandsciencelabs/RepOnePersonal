import {
    LOADING_HISTORY,
    COLLAPSE_HISTORY_SET,
    EXPAND_HISTORY_SET,
    PRESENT_HISTORY_FILTER,
    SHOW_VISUALIZATION_MODAL,
    SELECT_HISTORY_REP_ROW,
    DESELECT_HISTORY_REP_ROW,
    EXPORTING_CSV,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';

export const collapseSet = setID => (dispatch, getState) => {
    dispatch({
        type: COLLAPSE_HISTORY_SET,
        setID: setID,
    });
};

export const expandSet = setID => (dispatch, getState) => {
    dispatch({
        type: EXPAND_HISTORY_SET,
        setID: setID,
    });
};

export const deleteSet = setID => SetsActionCreators.deleteHistorySet(setID);

export const restoreSet = setID => SetsActionCreators.restoreHistorySet(setID);

export const finishLoading = () => ({
    type: LOADING_HISTORY,
    isLoading: false,
});

export const removeRep = (setID, repIndex) =>
    SetsActionCreators.removeHistoryRep(setID, repIndex);

export const restoreRep = (setID, repIndex) =>
    SetsActionCreators.restoreHistoryRep(setID, repIndex);

export const presentHistoryFilter = () => {
    Analytics.setCurrentScreen('history_filters');

    return {
        type: PRESENT_HISTORY_FILTER,
    };
};

export const selectRow =
    (setID, rep, repDisplay, overlayNumbers, isRemoved) =>
    (dispatch, getState) => {
        const state = getState();
        logSelectRowAnalytics(state);

        dispatch({
            type: SELECT_HISTORY_REP_ROW,
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
        type: DESELECT_HISTORY_REP_ROW,
    });
};

export const open3D = setID => {
    Analytics.setCurrentScreen('3d_visualization');
    return {
        type: SHOW_VISUALIZATION_MODAL,
        setID,
    };
};

export const exportCSV = () => {
    return {
        type: EXPORTING_CSV,
        isExportingCSV: true,
    };
};

// ANALYTICS

const logSelectRowAnalytics = state => {
    const setID = HistorySelectors.getSelectedRowSetID(state);
    const isRepRemoved = HistorySelectors.getSelectedRowIsRemoved(state);
    const isWorkingSet = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState(
        'history_select_row',
        {
            is_removed: isRepRemoved,
            is_working_set: isWorkingSet,
        },
        state,
    );
};

const logDeselectRowAnalytics = state => {
    const setID = HistorySelectors.getSelectedRowSetID(state);
    const isRepRemoved = HistorySelectors.getSelectedRowIsRemoved(state);
    const isWorkingSet = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState(
        'history_deselect_row',
        {
            is_removed: isRepRemoved,
            is_working_set: isWorkingSet,
        },
        state,
    );
};
