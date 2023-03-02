import { createSelector } from 'reselect';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';

const stateRoot = state => state.kratosColumnsSettings;

export const getMetrics = state => stateRoot(state).metrics;

export const getIsEditingMetric = state =>
    stateRoot(state).kratosEditingMetricRank !== null;

export const getEditingMetricRank = state =>
    stateRoot(state).kratosEditingMetricRank;

export const getCurrentMetric = state => {
    const rank = getEditingMetricRank(state);
    if (rank === null) {
        return null;
    }
    return stateRoot(state).metrics[rank - 1];
};

export const getColumnLabels = createSelector(getMetrics, metrics => {
    return metrics.map(metric => CollapsedMetrics.metricAbbreviation(metric));
});

export const getColumnUnits = createSelector(getMetrics, metrics => {
    return metrics.map(metric => CollapsedMetrics.metricUnit(metric));
});
