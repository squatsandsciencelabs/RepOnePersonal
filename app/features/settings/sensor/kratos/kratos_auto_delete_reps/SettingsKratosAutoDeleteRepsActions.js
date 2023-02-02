import { PRESENT_KRATOS_AUTO_DELETE_REPS } from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';

export const presentKratosAutoDeleteReps = () => {
    Analytics.setCurrentScreen('edit_kratos_auto_delete_reps');

    return {
        type: PRESENT_KRATOS_AUTO_DELETE_REPS,
    };
};
