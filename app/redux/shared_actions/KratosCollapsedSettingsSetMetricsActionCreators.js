import {
    SAVE_KRATOS_METRIC,
    SAVE_KRATOS_METRIC_1,
    SAVE_KRATOS_METRIC_2,
    SAVE_KRATOS_METRIC_3,
    SAVE_KRATOS_METRIC_4,
    SAVE_KRATOS_METRIC_5,
    SAVE_KRATOS_ROLLUP,
    SAVE_KRATOS_ROLLUP_1,
    SAVE_KRATOS_ROLLUP_2,
    SAVE_KRATOS_ROLLUP_3,
    SAVE_KRATOS_ROLLUP_4,
    SAVE_KRATOS_ROLLUP_5,
    SAVE_KRATOS_PHASE,
    SAVE_KRATOS_PHASE_1,
    SAVE_KRATOS_PHASE_2,
    SAVE_KRATOS_PHASE_3,
    SAVE_KRATOS_PHASE_4,
    SAVE_KRATOS_PHASE_5,
    SAVE_KRATOS_METRIC_ANDROID,
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

export const saveKratosCollapsedMetric1 = metric => ({
    type: SAVE_KRATOS_METRIC_1,
    metric: metric,
});

export const saveKratosCollapsedMetric2 = metric => ({
    type: SAVE_KRATOS_METRIC_2,
    metric: metric,
});

export const saveKratosCollapsedMetric3 = metric => ({
    type: SAVE_KRATOS_METRIC_3,
    metric: metric,
});

export const saveKratosCollapsedMetric4 = metric => ({
    type: SAVE_KRATOS_METRIC_4,
    metric: metric,
});

export const saveKratosCollapsedMetric5 = metric => ({
    type: SAVE_KRATOS_METRIC_5,
    metric: metric,
});

export const saveKratosRollup = rollup => ({
    type: SAVE_KRATOS_ROLLUP,
    rollup,
});

export const saveKratosRollup1 = rollup => ({
    type: SAVE_KRATOS_ROLLUP_1,
    rollup,
});

export const saveKratosRollup2 = rollup => ({
    type: SAVE_KRATOS_ROLLUP_2,
    rollup,
});

export const saveKratosRollup3 = rollup => ({
    type: SAVE_KRATOS_ROLLUP_3,
    rollup,
});

export const saveKratosRollup4 = rollup => ({
    type: SAVE_KRATOS_ROLLUP_4,
    rollup,
});

export const saveKratosRollup5 = rollup => ({
    type: SAVE_KRATOS_ROLLUP_5,
    rollup,
});

export const saveKratosPhase = phase => ({
    type: SAVE_KRATOS_PHASE,
    phase,
});

export const saveKratosPhase1 = phase => ({
    type: SAVE_KRATOS_PHASE_1,
    phase,
});

export const saveKratosPhase2 = phase => ({
    type: SAVE_KRATOS_PHASE_2,
    phase,
});

export const saveKratosPhase3 = phase => ({
    type: SAVE_KRATOS_PHASE_3,
    phase,
});

export const saveKratosPhase4 = phase => ({
    type: SAVE_KRATOS_PHASE_4,
    phase,
});

export const saveKratosPhase5 = phase => ({
    type: SAVE_KRATOS_PHASE_5,
    phase,
});
