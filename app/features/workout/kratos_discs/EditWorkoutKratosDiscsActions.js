import {
    REMOVE_WORKOUT_KRATOS_DISC,
    ADD_WORKOUT_KRATOS_DISC,
    DISMISS_WORKOUT_KRATOS_DISCS,
    SAVE_WORKOUT_SET_KRATOS_DISCS,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as DurationsSelectors from 'app/redux/selectors/DurationsSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

export const dismissKratosDiscs = () => {
    Analytics.setCurrentScreen('workout');

    return {
        type: DISMISS_WORKOUT_KRATOS_DISCS,
    };
};

export const cancelKratosDiscs = setID => (dispatch, getState) => {
    const state = getState();
    Analytics.setCurrentScreen('workout');
    logCancelEditKratosDiscsAnalytics(state, setID);

    dispatch({
        type: DISMISS_WORKOUT_KRATOS_DISCS,
    });
};

export const saveKratosDiscs =
    (setID, kratosDiscs = []) =>
    (dispatch, getState) => {
        const state = getState();
        logSaveKratosDiscsAnalytics(state, setID);
        dispatch({
            type: SAVE_WORKOUT_SET_KRATOS_DISCS,
            setID: setID,
            kratosDiscs: kratosDiscs,
        });
    };

export const tappedPill = setID => (dispatch, getState) => {
    const state = getState();
    logRemovedKratosDiscsAnalytics(state, setID);
    dispatch({
        type: REMOVE_WORKOUT_KRATOS_DISC,
    });
};

export const addPill = setID => (dispatch, getState) => {
    const state = getState();
    logAddKratosDiscAnalytics(state, setID);
    dispatch({
        type: ADD_WORKOUT_KRATOS_DISC,
    });
};

const logSaveKratosDiscsAnalytics = (state, setID) => {
    const is_working_set = SetsSelectors.getIsWorkingSet(state, setID);
    const duration = DurationsSelectors.getEditWorkoutKratosDiscsDuration(state);

    Analytics.logEventWithAppState(
        'save_kratos_discs',
        {
            value: duration,
            duration: duration,
            is_working_set: is_working_set,
        },
        state,
    );
};

const logCancelEditKratosDiscsAnalytics = (state, setID) => {
    const is_working_set = SetsSelectors.getIsWorkingSet(state, setID);
    const duration =
        DurationsSelectors.getEditWorkoutKratosDiscsDuration(state);

    Analytics.logEventWithAppState(
        'cancel_edit_kratos_discs',
        {
            value: duration,
            duration: duration,
            is_working_set: is_working_set,
        },
        state,
    );
};

const logRemovedKratosDiscsAnalytics = (state, setID) => {
    const is_working_set = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState(
        'remove_kratos_disc',
        {
            is_working_set: is_working_set,
        },
        state,
    );
};

const logAddKratosDiscAnalytics = (state, setID) => {
    const is_working_set = SetsSelectors.getIsWorkingSet(state, setID);

    Analytics.logEventWithAppState(
        'add_kratos_disc',
        {
            is_working_set: is_working_set,
        },
        state,
    );
};
