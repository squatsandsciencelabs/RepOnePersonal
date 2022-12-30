import {
    PRESENT_END_SET_TIMER,
    PRESENT_DEFAULT_METRIC,
    PRESENT_KRATOS_AUTO_DELETE_REPS,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';

export const presentEndSetTimer = () => {
    Analytics.setCurrentScreen('edit_end_set_timer');

    return {
        type: PRESENT_END_SET_TIMER,
    };
};

export const presentSetMetric = () => {
    Analytics.setCurrentScreen('edit_default_metric');

    return {
        type: PRESENT_DEFAULT_METRIC,
    };
};

export const presentKratosAutoDeleteReps = () => {
    Analytics.setCurrentScreen('edit_kratos_auto_delete_reps');

    return {
        type: PRESENT_KRATOS_AUTO_DELETE_REPS,
    };
};
