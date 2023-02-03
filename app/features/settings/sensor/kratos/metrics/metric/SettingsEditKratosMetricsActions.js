import { DISMISS_KRATOS_METRIC } from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as KratosCollapsedSettingsSetMetricsActionCreators from 'app/redux/shared_actions/KratosCollapsedSettingsSetMetricsActionCreators';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

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

        const selectors = {
            getKratosMetric1:
                KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric1,
            getKratosMetric2:
                KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric2,
            getKratosMetric3:
                KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric3,
            getKratosMetric4:
                KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric4,
            getKratosMetric5:
                KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric5,
        };
        
        const prevMetric = selectors[`getKratosMetric${rank}`](state);
        logChangeCollapsedMetricAnalytics(rank, prevMetric, metric, state);

        dispatch(
            KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetricAndroid(
                metric,
                rank,
            ),
        );
    };
export const saveCollapsedMetricSetting1 = metric => (dispatch, getState) => {
    const state = getState();
    const prevMetric =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric1(state);
    logChangeCollapsedMetricAnalytics(1, prevMetric, metric, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetric1(
            metric,
        ),
    );
};

export const saveCollapsedMetricSetting2 = metric => (dispatch, getState) => {
    const state = getState();
    const prevMetric =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric2(state);
    logChangeCollapsedMetricAnalytics(2, prevMetric, metric, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetric2(
            metric,
        ),
    );
};

export const saveCollapsedMetricSetting3 = metric => (dispatch, getState) => {
    const state = getState();
    const prevMetric =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric3(state);
    logChangeCollapsedMetricAnalytics(3, prevMetric, metric, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetric3(
            metric,
        ),
    );
};

export const saveCollapsedMetricSetting4 = metric => (dispatch, getState) => {
    const state = getState();
    const prevMetric =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric4(state);
    logChangeCollapsedMetricAnalytics(4, prevMetric, metric, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetric4(
            metric,
        ),
    );
};

export const saveCollapsedMetricSetting5 = metric => (dispatch, getState) => {
    const state = getState();
    const prevMetric =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric5(state);
    logChangeCollapsedMetricAnalytics(5, prevMetric, metric, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosCollapsedMetric5(
            metric,
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
