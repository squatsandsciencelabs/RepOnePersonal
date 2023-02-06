import { DISMISS_KRATOS_METRIC } from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as KratosCollapsedSettingsSetMetricsActionCreators from 'app/redux/shared_actions/KratosCollapsedSettingsSetMetricsActionCreators';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';
import { getKratosMetricByRank } from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

export const saveKratosCollapsedMetricSetting =
    metric => (dispatch, getState) => {
        const state = getState();
        const prevMetric =
            KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosMetric(
                state,
            );
        const rank =
            KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosCollapsedMetricRank(
                state,
            );

        logChangeCollapsedMetricAnalytics(rank, prevMetric, metric, state);

        dispatch(
            KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetric(
                metric,
            ),
        );
    };

export const saveKratosCollapsedMetricSettingAndroid =
    (metric, rank) => (dispatch, getState) => {
        const state = getState();

        const prevMetric = getKratosMetricByRank(state, rank);
        logChangeCollapsedMetricAnalytics(rank, prevMetric, metric, state);

        dispatch(
            KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetricAndroid(
                metric,
                rank,
            ),
        );
    };

export const dismissKratosCollapsedMetricSetter = () => {
    Analytics.setCurrentScreen('settings');

    return {
        type: DISMISS_KRATOS_METRIC,
    };
};

// ANALYTICS

const logChangeCollapsedMetricAnalytics = (rank, prevMetric, metric, state) => {
    Analytics.logEventWithAppState(
        'change_kratos_collapsed_metric',
        {
            rank: rank,
            from_metric: prevMetric,
            to_metric: metric,
        },
        state,
    );
};
