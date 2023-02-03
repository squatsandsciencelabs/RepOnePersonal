import {
    PRESENT_KRATOS_METRIC,
    PRESENT_KRATOS_ROLLUP,
    PRESENT_KRATOS_PHASE,
    DISMISS_KRATOS_METRIC,
    DISMISS_KRATOS_ROLLUP,
    DISMISS_KRATOS_PHASE,
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

import {
    AVG_VELOCITY_METRIC,
    RPE_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKV_METRIC,
    EMPTY_QUANTIFIER,
    LAST_REP_QUANTIFIER,
    MIN_QUANTIFIER,
    CONCENTRIC,
    EMPTY_METRIC,
    SET_LOSS_QUANTIFIER,
    PEAK_END_QUANTIFIER,
    PKH_METRIC,
    FORCE_HEIGHT_METRIC,
    POWER_HEIGHT_METRIC,
    MAX_EVER_QUANTIFIER,
    MIN_EVER_QUANTIFIER,
    LINEAR_3D_ROM_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';

const createDefaultState = () => ({
    metric1: AVG_VELOCITY_METRIC,
    rollup1: LAST_REP_QUANTIFIER,
    phase1: CONCENTRIC,

    metric2: RPE_METRIC,
    rollup2: EMPTY_QUANTIFIER,
    phase2: CONCENTRIC,

    metric3: ROM_METRIC,
    rollup3: MIN_QUANTIFIER,
    phase3: CONCENTRIC,

    metric4: PKV_METRIC,
    rollup4: LAST_REP_QUANTIFIER,
    phase4: CONCENTRIC,

    metric5: DURATION_METRIC,
    rollup5: MIN_QUANTIFIER,
    phase5: CONCENTRIC,

    currentKratosCollapsedMetricRank: null,
    isEditingMetric: false,
    isEditingRollup: false,
    isEditingPhase: false,
});

const KratosCollapsedSettingsSetMetricsReducer = (
    state = createDefaultState(),
    action,
) => {
    let changes = null;
    let rank = null;

    switch (action.type) {
        case PRESENT_KRATOS_METRIC:
            console.log('PRESENT_KRATOS_METRIC', action.metricRank);
            return {
                ...state,
                currentKratosCollapsedMetricRank: action.metricRank,
                isEditingMetric: true,
            };
        case PRESENT_KRATOS_ROLLUP:
            return {
                ...state,
                currentKratosCollapsedMetricRank: action.rollupRank,
                isEditingRollup: true,
            };
        case PRESENT_KRATOS_PHASE:
            return {
                ...state,
                currentKratosCollapsedMetricRank: action.phaseRank,
                isEditingPhase: true,
            };
        case DISMISS_KRATOS_METRIC:
        case DISMISS_KRATOS_ROLLUP:
        case DISMISS_KRATOS_PHASE:
            return {
                ...state,
                currentKratosCollapsedMetricRank: null,
                isEditingMetric: false,
                isEditingRollup: false,
                isEditingPhase: false,
            };
        case SAVE_KRATOS_METRIC:
            changes = {};
            rank = state.currentKratosCollapsedMetricRank;
            changes[`metric${rank}`] = action.metric;

            if (shouldResetRollup(action.metric)) {
                changes[`rollup${rank}`] = EMPTY_QUANTIFIER;
            }

            return {
                ...state,
                ...changes,
            };
        case SAVE_KRATOS_METRIC_ANDROID:
            console.log(
                'state.currentKratosCollapsedMetricRank save kratos metric N',
                action.rank,
            );
            changes = {};
            rank = action.rank;
            changes[`metric${rank}`] = action.metric;

            if (shouldResetRollup(action.metric)) {
                changes[`rollup${rank}`] = EMPTY_QUANTIFIER;
            }

            return {
                ...state,
                ...changes,
            };
        case SAVE_KRATOS_ROLLUP:
            changes = {};
            rank = state.currentKratosCollapsedMetricRank;
            changes[`rollup${rank}`] = action.rollup;

            if (shouldResetMetric(action.rollup, state[`metric${rank}`])) {
                changes[`metric${rank}`] = EMPTY_METRIC;
            }

            return {
                ...state,
                ...changes,
            };
        case SAVE_KRATOS_ROLLUP_1:
        case SAVE_KRATOS_ROLLUP_2:
        case SAVE_KRATOS_ROLLUP_3:
        case SAVE_KRATOS_ROLLUP_4:
        case SAVE_KRATOS_ROLLUP_5:
            console.log(
                'state.currentKratosCollapsedMetricRank save kratos rollup N',
                state.currentKratosCollapsedMetricRank,
            );
            return state;
        case SAVE_KRATOS_PHASE:
            changes = {};
            rank = state.currentKratosCollapsedMetricRank;
            changes[`phase${rank}`] = action.phase;

            return {
                ...state,
                ...changes,
            };
        case SAVE_KRATOS_PHASE_1:
        case SAVE_KRATOS_PHASE_2:
        case SAVE_KRATOS_PHASE_3:
        case SAVE_KRATOS_PHASE_4:
        case SAVE_KRATOS_PHASE_5:
            console.log(
                'state.currentKratosCollapsedMetricRank save kratos phase N',
                state.currentKratosCollapsedMetricRank,
            );
            return state;
        default:
            return state;
    }
};

const shouldResetRollup = metric => metric === RPE_METRIC;

const shouldResetMetric = (rollup, metric) => {
    if (metric === RPE_METRIC) {
        return true;
    }
    if (
        (rollup === SET_LOSS_QUANTIFIER || rollup === PEAK_END_QUANTIFIER) &&
        (metric === PKH_METRIC ||
            metric === FORCE_HEIGHT_METRIC ||
            metric === POWER_HEIGHT_METRIC)
    ) {
        return true;
    }
    return (
        (rollup === MAX_EVER_QUANTIFIER || rollup === MIN_EVER_QUANTIFIER) &&
        (metric === PKH_METRIC ||
            metric === FORCE_HEIGHT_METRIC ||
            metric === POWER_HEIGHT_METRIC ||
            metric === ROM_METRIC ||
            metric === LINEAR_3D_ROM_METRIC)
    );
};
export default KratosCollapsedSettingsSetMetricsReducer;
