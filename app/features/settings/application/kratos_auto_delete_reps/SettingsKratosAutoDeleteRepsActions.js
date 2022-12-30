import * as SettingsActionCreators from 'app/redux/shared_actions/SettingsActionCreators';
import * as Analytics from 'app/services/Analytics';
import { DISMISS_KRATOS_AUTO_DELETE_REPS } from 'app/configs+constants/ActionTypes';
import { DEFAULT_KRATOS_AUTO_DELETE_REPS } from 'app/configs+constants/KratosConfig';

export const saveKratosAutoDeleteRepsSetting =
    (autoDeleteReps = DEFAULT_KRATOS_AUTO_DELETE_REPS) =>
    (dispatch, getState) => {
        const state = getState();

        logChangeKratosAutoDeleteRepsAnalytics(autoDeleteReps, state);

        dispatch(
            SettingsActionCreators.saveKratosAutoDeleteReps(autoDeleteReps),
        );
    };

export const dismissKratosAutoDeleteRepsSetter = () => {
    Analytics.setCurrentScreen('settings');

    return {
        type: DISMISS_KRATOS_AUTO_DELETE_REPS,
    };
};

// ANALYTICS

const logChangeKratosAutoDeleteRepsAnalytics = (autoDeleteReps, state) => {
    Analytics.logEventWithAppState(
        'change_kratos_auto_delete_reps',
        {
            auto_delete_reps: autoDeleteReps,
        },
        state,
    );
};
