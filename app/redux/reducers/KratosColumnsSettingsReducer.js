import {
    PRESENT_KRATOS_COLUMN_METRIC,
    DISMISS_KRATOS_COLUMN_METRIC,
    SAVE_KRATOS_COLUMN_METRIC,
} from 'app/configs+constants/ActionTypes';

import {
    AVG_VELOCITY_METRIC,
    PKV_METRIC,
    ROM_METRIC,
    PEAK_FORCE_METRIC,
    PEAK_POWER_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';
import { MEAN_FORCE_METRIC } from '../../configs+constants/CollapsedMetricTypes';

const defaultState = {
    metrics: [
        AVG_VELOCITY_METRIC,
        PKV_METRIC,
        PEAK_FORCE_METRIC,
        PEAK_POWER_METRIC,
        ROM_METRIC,
    ],
    kratosEditingMetricRank: null, // should be 1-5 if editing, null otherwise
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case PRESENT_KRATOS_COLUMN_METRIC:
            return {
                ...state,
                kratosEditingMetricRank: action.rank,
            };
        case DISMISS_KRATOS_COLUMN_METRIC:
            return {
                ...state,
                kratosEditingMetricRank: null,
            };
        case SAVE_KRATOS_COLUMN_METRIC:
            const metrics = [...state.metrics];
            metrics[action.rank - 1] = action.metric; // note: not grabbing from editingMetricRank due to potential iOS vs Andoid differences
            return {
                ...state,
                metrics,
            };
        default:
            return state;
    }
};
