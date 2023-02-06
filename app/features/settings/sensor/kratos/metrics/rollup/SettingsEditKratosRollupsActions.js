import { DISMISS_KRATOS_ROLLUP } from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as KratosCollapsedSettingsSetMetricsActionCreators from 'app/redux/shared_actions/KratosCollapsedSettingsSetMetricsActionCreators';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

export const saveRollupSetting = rollup => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosRollup(
            state,
        );
    const rank =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosCollapsedMetricRank(
            state,
        );
    logChangeRollupAnalytics(rank, prevRollup, rollup, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollup(
            rollup,
        ),
    );
};

export const saveRollupSettingAndroid =
    (rollup, rank) => (dispatch, getState) => {
        const state = getState();

        const prevRollup =
            KratosCollapsedSettingsSetMetricsSelectors.getKratosRollupByRank(
                state,
                rank,
            );
        logChangeRollupAnalytics(rank, prevRollup, rollup, state);

        dispatch(
            KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollupAndroid(
                rollup,
                rank,
            ),
        );
    };

export const dismissRollupSetter = () => {
    Analytics.setCurrentScreen('settings');

    return {
        type: DISMISS_KRATOS_ROLLUP,
    };
};

// ANALYTICS

const logChangeRollupAnalytics = (rank, prevRollup, rollup, state) => {
    Analytics.logEventWithAppState(
        'change_kratos_rollup',
        {
            rank: rank,
            from_rollup: prevRollup,
            to_rollup: rollup,
        },
        state,
    );
};
