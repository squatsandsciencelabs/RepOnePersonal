import { PRESENT_KRATOS_COLUMN_METRIC } from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';

export const presentEdit = rank => {
    Analytics.setCurrentScreen('edit_kratos_column_metric');

    return {
        type: PRESENT_KRATOS_COLUMN_METRIC,
        rank,
    };
};
