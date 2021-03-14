import {
    DISMISS_COLUMN_METRIC,
    SAVE_COLUMN_METRIC,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';

export const saveColumnSetting = (metric, rank) => (dispatch, getState) => {
    const state = getState();
    if (rank === null || rank === undefined) {
        rank = ColumnsSettingsSelectors.getEditingMetricRank(state);

    }
    const prevMetric = ColumnsSettingsSelectors.getMetrics(state)[rank-1];
    logChangeColumnAnalytics(rank, prevMetric, metric, state);

    dispatch({
        type: SAVE_COLUMN_METRIC,
        rank,
        metric,
    });
};

export const dismissColumnSetter = () => {
    Analytics.setCurrentScreen('settings');
    
    return {
        type: DISMISS_COLUMN_METRIC,    
    };
};

// ANALYTICS

const logChangeColumnAnalytics = (rank, prevMetric, metric, state) => {
    Analytics.logEventWithAppState('change_column_metric', {
        rank: rank,
        from_metric: prevMetric,
        to_metric: metric,
    }, state);
};
