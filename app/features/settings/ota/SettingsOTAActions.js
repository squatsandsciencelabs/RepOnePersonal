import {
    OTA_DOWNLOAD_ATTEMPT,
    CANCEL_OTA_DOWNLOAD,
    DELETE_OTA_DOWNLOAD,

    INSTALL_OTA_ATTEMPT,
    CANCEL_INSTALL_OTA,
} from 'app/configs+constants/ActionTypes';
// import * as Analytics from 'app/services/Analytics';
// import * as OTASelectors from 'app/redux/selectors/OTASelectors';
// import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';

export const download = () => (dispatch, getState) => {
    // const state = getState();
    // logOTAAnalytics(state, 'download_firmware');
    dispatch ({ type: OTA_DOWNLOAD_ATTEMPT });
};

export const cancelDownload = () => (dispatch, getState) => {
    // const state = getState();
    // logOTAAnalytics(state, 'cancel_download_firmware');
    dispatch ({ type: CANCEL_OTA_DOWNLOAD });
};

export const deleteDownload = () => (dispatch, getState) => {
    // const state = getState();
    // logOTAAnalytics(state, 'delete_downloaded_firmware');
    dispatch ({ type: DELETE_OTA_DOWNLOAD });
};

export const install = () => (dispatch, getState) => {
    // const state = getState();
    // logOTAAnalytics(state, 'install_firmware');
    dispatch ({ type: INSTALL_OTA_ATTEMPT });
};

export const cancelInstall = () => (dispatch, getState) => {
    // const state = getState();
    // logOTAAnalytics(state, 'cancel_install_firmware');
    dispatch ({ type: CANCEL_INSTALL_OTA });
};

// const logOTAAnalytics = (state, event) => {
//     Analytics.logEventWithAppState(event, {
//         device_firmware_version: ConnectedDeviceStatusSelectors.getFirmwareVersion(state),
//         server_firmware_version: OTASelectors.getFirmwareVersion(state),
//     }, state);
// };
