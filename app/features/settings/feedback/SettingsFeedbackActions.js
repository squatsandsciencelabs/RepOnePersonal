import {
    Linking
} from 'react-native';

import {
    FEEDBACK,
    SHOW_VISUALIZATION_MODAL,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';

export const presentFeedback = () => (dispatch, getState) => {
    // TODO: move this to config
    Linking.openURL('mailto:help@getrepone.com?subject=A%20really%20nice%20comment%20from%20an%20app%20user&body=');

    const state = getState();
    logFeedbackAnalytics(state);

    dispatch({
        type: FEEDBACK
    });
};

// TODO: remove this test code
export const showVisualization = () => ({
    type: SHOW_VISUALIZATION_MODAL,
});

const logFeedbackAnalytics = (state) => {
    Analytics.logEventWithAppState('feedback', {
    }, state);
};
