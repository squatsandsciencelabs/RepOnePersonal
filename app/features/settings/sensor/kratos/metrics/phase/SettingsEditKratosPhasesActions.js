import { DISMISS_KRATOS_PHASE } from 'app/configs+constants/ActionTypes';
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

export const savePhaseSettingAndroid =
    (phase, rank) => (dispatch, getState) => {
        const state = getState();

        const prevPhase =
            KratosCollapsedSettingsSetMetricsSelectors.getKratosPhaseByRank(
                state,
                rank,
            );
        logChangePhaseAnalytics(rank, prevPhase, phase, state);

        dispatch(
            KratosCollapsedSettingsSetMetricsActionCreators.saveKratosPhaseAndroid(
                phase,
                rank,
            ),
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
