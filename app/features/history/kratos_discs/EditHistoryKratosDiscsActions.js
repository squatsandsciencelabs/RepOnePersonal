import {
    DISMISS_HISTORY_KRATOS_DISCS,
    SAVE_HISTORY_SET_KRATOS_DISCS,
    REMOVE_HISTORY_KRATOS_DISC,
    ADD_HISTORY_KRATOS_DISC,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as DurationsSelectors from 'app/redux/selectors/DurationsSelectors';

export const dismissKratosDiscs = () => {
    Analytics.setCurrentScreen('history');

    return {
        type: DISMISS_HISTORY_KRATOS_DISCS,
    };
};

export const cancelKratosDiscs = () => (dispatch, getState) => {
    const state = getState();
    Analytics.setCurrentScreen('history');
    logCancelEditKratosDiscsAnalytics(state);

    dispatch({
        type: DISMISS_HISTORY_KRATOS_DISCS,
    });
};

export const saveKratosDiscs =
    (setID, kratosDiscs = []) =>
    (dispatch, getState) => {
        const state = getState();
        logSaveKratosDiscsAnalytics(state);
        dispatch({
            type: SAVE_HISTORY_SET_KRATOS_DISCS,
            setID: setID,
            kratosDiscs: kratosDiscs,
        });
    };

export const tappedPill = setID => (dispatch, getState) => {
    const state = getState();
    logRemovedKratosDiscsAnalytics(state);
    dispatch({
        type: REMOVE_HISTORY_KRATOS_DISC,
    });
};

export const addPill = setID => (dispatch, getState) => {
    const state = getState();
    logAddKratosDiscAnalytics(state);
    dispatch({
        type: ADD_HISTORY_KRATOS_DISC,
    });
};

const logSaveKratosDiscsAnalytics = state => {
    const duration =
        DurationsSelectors.getEditHistoryKratosDiscsDuration(state);

    Analytics.logEventWithAppState(
        'save_kratos_discs',
        {
            value: duration,
            duration: duration,
            is_working_set: false,
        },
        state,
    );
};

const logCancelEditKratosDiscsAnalytics = state => {
    const duration =
        DurationsSelectors.getEditHistoryKratosDiscsDuration(state);

    Analytics.logEventWithAppState(
        'cancel_edit_kratos_discs',
        {
            value: duration,
            duration: duration,
            is_working_set: false,
        },
        state,
    );
};

const logRemovedKratosDiscsAnalytics = state => {
    Analytics.logEventWithAppState(
        'remove_kratos_disc',
        {
            is_working_set: false,
        },
        state,
    );
};

const logAddKratosDiscAnalytics = state => {
    Analytics.logEventWithAppState(
        'add_kratos_disc',
        {
            is_working_set: false,
        },
        state,
    );
};
