// note: for now not considering this tied to logging in or out, more about the app itself

import {
    OTA_DOWNLOAD_AVAILABLE,
    OTA_DOWNLOAD_ATTEMPT,
    CANCEL_OTA_DOWNLOAD,
    OTA_DOWNLOAD_READY,
    OTA_DOWNLOAD_SUCCEEDED,
    OTA_DOWNLOAD_FAILED,
    DELETE_OTA_DOWNLOAD,
    INSTALL_OTA_ATTEMPT,
    CANCEL_INSTALL_OTA,
    INSTALL_OTA_SUCCEEDED,
    INSTALL_OTA_FAILED,
} from 'app/configs+constants/ActionTypes';

export const OTAStatus = {
    AVAILABLE: 'AVAILABLE',
    DOWNLOADING: 'DOWNLOADING',
    DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',
    READY: 'READY',
    INSTALLING: 'INSTALLING',
    INSTALL_FAILED: 'INSTALL_FAILED',
    INSTALL_SUCCEEDED: 'INSTALL_SUCCEEDED',
};

// device can be obtained from the deviceReducer
// what do I do if it becomes available mid install
const defaultState = {
    firmwareVersion: "1.0.0", // only this should be preserved, other values should start at null
    status: null, // null, AVAILABLE, DOWNLOADING, DOWNLOAD_FAILED, READY, INSTALLING, INSTALL_FAILED, INSTALL_SUCCEEDED
};

const OTAReducer = (state = defaultState, action) => {
    switch (action.type) {
        case OTA_DOWNLOAD_AVAILABLE:
            return {
                ...state,
                firmwareVersion: action.firmwareVersion,
                status: OTAStatus.AVAILABLE,
            };
        case OTA_DOWNLOAD_READY:
            return {
                ...state,
                status: OTAStatus.READY,
            };
        case OTA_DOWNLOAD_ATTEMPT:
            return {
                ...state,
                status: OTAStatus.DOWNLOADING,
            };
        case CANCEL_OTA_DOWNLOAD:
            return {
                ...state,
                status: OTAStatus.AVAILABLE,
            };
        case OTA_DOWNLOAD_SUCCEEDED:
            return {
                ...state,
                status: OTAStatus.READY,
            };
        case OTA_DOWNLOAD_FAILED:
            return {
                ...state,
                status: OTAStatus.DOWNLOAD_FAILED,
            };
        case DELETE_OTA_DOWNLOAD:
            return {
                ...state,
                status: null,
            };
        case INSTALL_OTA_ATTEMPT:
            return {
                ...state,
                status: OTAStatus.INSTALLING,
            };
        case CANCEL_INSTALL_OTA:
            return {
                ...state,
                status: OTAStatus.READY,
            };
        case INSTALL_OTA_SUCCEEDED:
            return {
                ...state,
                status: OTAStatus.INSTALL_SUCCEEDED,
            };
        case INSTALL_OTA_FAILED:
            return {
                ...state,
                status: OTAStatus.INSTALL_FAILED,
            };
        default:
            return state;
    }
};

export default OTAReducer;