import {
    ADD_HISTORY_FILTER_DEVICE,
    DISMISS_HISTORY_FILTER_DEVICES,
    REMOVE_HISTORY_FILTER_DEVICE,
    SAVE_HISTORY_FILTER_DEVICES,
} from 'app/configs+constants/ActionTypes';

export const addPill = () => ({
    type: ADD_HISTORY_FILTER_DEVICE,
});

export const tappedPill = () => ({
    type: REMOVE_HISTORY_FILTER_DEVICE,
});

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
