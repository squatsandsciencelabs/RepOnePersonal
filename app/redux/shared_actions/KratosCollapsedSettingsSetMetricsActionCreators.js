import {
    SAVE_KRATOS_METRIC,
    SAVE_KRATOS_ROLLUP,
    SAVE_KRATOS_PHASE,
    SAVE_KRATOS_METRIC_ANDROID,
    SAVE_KRATOS_PHASE_ANDROID,
    SAVE_KRATOS_ROLLUP_ANDROID,
} from 'app/configs+constants/ActionTypes';

export const saveKratosCollapsedMetric = metric => ({
    type: SAVE_KRATOS_METRIC,
    metric: metric,
});

export const saveKratosCollapsedMetricAndroid = (metric, rank) => ({
    type: SAVE_KRATOS_METRIC_ANDROID,
    metric,
    rank,
});

export const saveKratosRollup = rollup => ({
    type: SAVE_KRATOS_ROLLUP,
    rollup,
});

export const saveKratosRollupAndroid = (rollup, rank) => ({
    type: SAVE_KRATOS_ROLLUP_ANDROID,
    rollup,
    rank,
});

export const saveKratosPhase = phase => ({
    type: SAVE_KRATOS_PHASE,
    phase,
});

export const saveKratosPhaseAndroid = (phase, rank) => ({
    type: SAVE_KRATOS_PHASE_ANDROID,
    phase,
    rank,
});
