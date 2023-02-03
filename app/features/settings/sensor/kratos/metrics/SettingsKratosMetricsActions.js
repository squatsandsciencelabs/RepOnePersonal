import {
    PRESENT_KRATOS_ROLLUP,
    PRESENT_KRATOS_METRIC,
    PRESENT_KRATOS_PHASE,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';

export const presentMetric = rank => (dispatch, getState) => {
    const state = getState();

    Analytics.setCurrentScreen('edit_collapsed_kratos_metric');

    dispatch({
        type: PRESENT_KRATOS_METRIC,
        metricRank: rank,
    });
};

export const presentRollup = rank => (dispatch, getState) => {
    const state = getState();

    Analytics.setCurrentScreen('edit_kratos_rollup');

    dispatch({
        type: PRESENT_KRATOS_ROLLUP,
        rollupRank: rank,
    });
};

export const presentPhase = rank => (dispatch, getState) => {
    const state = getState();

    Analytics.setCurrentScreen('edit_kratos_phase');

    dispatch({
        type: PRESENT_KRATOS_PHASE,
        phaseRank: rank,
    });
};
