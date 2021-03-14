import {
    PRESENT_COLUMN_METRIC,
    DISMISS_COLUMN_METRIC,
    SAVE_COLUMN_METRIC,
} from 'app/configs+constants/ActionTypes';

import {
    AVG_VELOCITY_METRIC,
    PKV_METRIC,
    PKH_METRIC,
    ROM_METRIC,
    DURATION_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';

const defaultState = {
    metrics: [
        AVG_VELOCITY_METRIC,
        PKV_METRIC,
        PKH_METRIC,
        ROM_METRIC,
        DURATION_METRIC,
    ],
    editingMetricRank: null, // should be 1-5 if editing, null otherwise
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case PRESENT_COLUMN_METRIC:
            return {
                ...state,
                editingMetricRank: action.rank,
            };
        case DISMISS_COLUMN_METRIC:
            return {
                ...state,
                editingMetricRank: null,
            };
        case SAVE_COLUMN_METRIC:
            const metrics = [...state.metrics];
            metrics[action.rank-1] = action.metric; // note: not grabbing from editingMetricRank due to potential iOS vs Andoid differences
            return {
                ...state,
                metrics,
            };
        default:
            return state;
    }
};
