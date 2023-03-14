import {
    ADD_HISTORY_FILTER_DEVICE,
    DISMISS_HISTORY_FILTER_DEVICES,
    REMOVE_HISTORY_FILTER_DEVICE,
    SAVE_HISTORY_FILTER_DEVICES,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';

export const addPill = () => (dispatch, getState) => {
    const state = getState();
    logAddDeviceAnalytics(state);

    dispatch({ type: ADD_HISTORY_FILTER_DEVICE });
};

export const tappedPill = () => (dispatch, getState) => {
    const state = getState();
    logRemovedDeviceAnalytics(state);

    dispatch({ type: REMOVE_HISTORY_FILTER_DEVICE });
};

export const cancelDevices = () => ({
    type: DISMISS_HISTORY_FILTER_DEVICES,
});

export const dismissDevices = () => ({
    type: DISMISS_HISTORY_FILTER_DEVICES,
});

export const saveDevices = (devices = []) => ({
    type: SAVE_HISTORY_FILTER_DEVICES,
    devices,
});

const logAddDeviceAnalytics = state => {
    Analytics.logEventWithAppState('history_add_device', {}, state);
};

const logRemovedDeviceAnalytics = state => {
    Analytics.logEventWithAppState('history_remove_device', {}, state);
};
