import {
    PRESENT_KRATOS_METRIC,
    PRESENT_KRATOS_ROLLUP,
    DISMISS_KRATOS_METRIC,
    DISMISS_KRATOS_ROLLUP,
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
} from 'app/configs+constants/ActionTypes';

import {
    AVG_VELOCITY_METRIC,
    RPE_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKV_METRIC,
    EMPTY_QUANTIFIER,
    LAST_REP_QUANTIFIER,
    MIN_QUANTIFIER,
} from 'app/configs+constants/CollapsedMetricTypes';

const KratosCollapsedSettingsSetMetricsReducer = (
    state = createDefaultState(),
    action,
) => {
    switch (action.type) {
        case PRESENT_KRATOS_METRIC:
        case PRESENT_KRATOS_ROLLUP:
        case DISMISS_KRATOS_METRIC:
        case DISMISS_KRATOS_ROLLUP:
        case SAVE_KRATOS_METRIC:
        case SAVE_KRATOS_METRIC_1:
        case SAVE_KRATOS_METRIC_2:
        case SAVE_KRATOS_METRIC_3:
        case SAVE_KRATOS_METRIC_4:
        case SAVE_KRATOS_METRIC_5:
        case SAVE_KRATOS_ROLLUP:
        case SAVE_KRATOS_ROLLUP_1:
        case SAVE_KRATOS_ROLLUP_2:
        case SAVE_KRATOS_ROLLUP_3:
        case SAVE_KRATOS_ROLLUP_4:
        case SAVE_KRATOS_ROLLUP_5:
        default:
            return state;
    }
};

const createDefaultState = () => ({
    metric1: AVG_VELOCITY_METRIC,
    rollup1: LAST_REP_QUANTIFIER,
    metric2: RPE_METRIC,
    rollup2: EMPTY_QUANTIFIER,
    metric3: ROM_METRIC,
    rollup3: MIN_QUANTIFIER,
    metric4: PKV_METRIC,
    rollup4: LAST_REP_QUANTIFIER,
    metric5: DURATION_METRIC,
    rollup5: MIN_QUANTIFIER,
    currentKratosCollapsedMetricRank: null,
    isEditingMetric: false,
    isEditingRollup: false,
});

export default KratosCollapsedSettingsSetMetricsReducer;
