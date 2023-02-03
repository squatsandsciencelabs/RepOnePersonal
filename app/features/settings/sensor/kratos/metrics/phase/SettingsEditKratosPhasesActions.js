import {
    DISMISS_KRATOS_PHASE,
    DISMISS_KRATOS_ROLLUP,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as KratosCollapsedSettingsSetMetricsActionCreators from 'app/redux/shared_actions/KratosCollapsedSettingsSetMetricsActionCreators';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

export const savePhaseSetting = phase => (dispatch, getState) => {
    const state = getState();
    const prevPhase =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosPhase(state);
    const rank =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosCollapsedMetricRank(
            state,
        );
    logChangePhaseAnalytics(rank, prevPhase, phase, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosPhase(phase),
    );
};

export const savePhase1Setting = phase => (dispatch, getState) => {
    const state = getState();
    const prevPhase =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase1(state);
    logChangePhaseAnalytics(1, prevPhase, phase, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosPhase1(phase),
    );
};

export const savePhase2Setting = phase => (dispatch, getState) => {
    const state = getState();
    const prevPhase =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase2(state);
    logChangePhaseAnalytics(2, prevPhase, phase, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosPhase2(phase),
    );
};

export const savePhase3Setting = prevPhase => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase3(state);
    logChangePhaseAnalytics(3, prevRollup, prevPhase, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosPhase3(
            prevPhase,
        ),
    );
};

export const savePhase4Setting = phase => (dispatch, getState) => {
    const state = getState();
    const prevPhase =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase4(state);
    logChangePhaseAnalytics(4, prevPhase, prevPhase, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosPhase4(
            prevPhase,
        ),
    );
};

export const savePhase5Setting = phase => (dispatch, getState) => {
    const state = getState();
    const prevPhase =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase5(state);
    logChangePhaseAnalytics(5, prevPhase, phase, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosPhase5(phase),
    );
};

export const dismissPhaseSetter = () => {
    Analytics.setCurrentScreen('settings');

    return {
        type: DISMISS_KRATOS_PHASE,
    };
};

// ANALYTICS

const logChangePhaseAnalytics = (rank, prevPhase, phase, state) => {
    Analytics.logEventWithAppState(
        'change_kratos_phase',
        {
            rank: rank,
            from_phase: prevPhase,
            to_phase: phase,
        },
        state,
    );
};
