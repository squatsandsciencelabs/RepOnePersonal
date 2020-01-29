import {
    takeEvery,
    put,
    apply,
    all,
    call,
    select,
} from 'redux-saga/effects';
import RNFetchBlob from 'rn-fetch-blob';

import { 
    STORE_INITIALIZED,
    OTA_DOWNLOAD_READY,
    OTA_DOWNLOAD_AVAILABLE,
    OTA_DOWNLOAD_ATTEMPT,
    CANCEL_OTA_DOWNLOAD,
    OTA_DOWNLOAD_SUCCEEDED,
    OTA_DOWNLOAD_FAILED,
    DELETE_OTA_DOWNLOAD,

    INSTALL_OTA_ATTEMPT,
    CANCEL_INSTALL_OTA,
    INSTALL_OTA_SUCCEEDED,
    INSTALL_OTA_FAILED,
} from 'app/configs+constants/ActionTypes';
import * as OTASelectors from 'app/redux/selectors/OTASelectors';

let downloadTask = null;
const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/firmware.zip`; // TODO: set the correct filepath for iOS and Android so it doesn't get killed by temp directory

const OTASaga = function * OTASaga() {
    yield all([
        takeEvery(STORE_INITIALIZED, checkOTA),
        takeEvery(OTA_DOWNLOAD_ATTEMPT, startDownload),
        takeEvery(CANCEL_OTA_DOWNLOAD, cancelDownload),
        takeEvery(DELETE_OTA_DOWNLOAD, deleteDownload),
        takeEvery(INSTALL_OTA_ATTEMPT, startInstall),
        takeEvery(CANCEL_INSTALL_OTA, cancelInstall),
    ]);
};

function *checkOTA(action) {
    // fetch instantly on initialization
    yield apply(fbconfig, fbconfig.fetch, [0]);

    // activate
    const activated = yield apply(fbconfig, fbconfig.activateFetched);
    if (!activated) {
        console.tron.log("Fetched data not activated");
        // NOTE: not logging this as it appears to still work regardless of activation?
        // state = yield select();
        // logUpdateSurveyURLErrorAnalytics(state, 'fetched data not activated');
    }

    // get url
    const snapshot = yield apply(fbconfig, fbconfig.getValue, ['firmware_version']);
    const firmwareVersion = snapshot.val();

    // check version against disk
    const currentVersion = yield select(OTASelectors.getFirmwareVersion);
    if (currentVersion !== firmwareVersion) {
        try {
            yield apply(RNFetchBlob, RNFetchBlob.fs.unlink, [filePath]);
        } catch (err) {
            console.tron.log(`failed to delete download ${err}`);
        }
        yield put({
            type: OTA_DOWNLOAD_AVAILABLE,
            firmwareVersion,
        });
        const state = yield select();
        logOTAAnalytics(state, 'new_firmware_available');
        return;
    }

    // TODO: confirm it works on iOS as this failed for the temp camera cache directory
    // check against disk
    const exists = yield apply(RNFetchBlob, RNFetchBlob.fs.exists, [filePath]);
    if (exists) {
        yield put({
            type: OTA_DOWNLOAD_READY,
        });
    }

    // shouldn't have to handle empty state
}

function *startDownload(action) {
    try {
        const currentVersion = yield select(OTASelectors.getFirmwareVersion);
        downloadTask = RNFetchBlob
            .config({
                // response data will be saved to this path if it has access right.
                path: filePath,
            })
            .fetch('GET', `https://firmware.reponestrength.com/${currentVersion}.zip`);
        const result = yield call(downloadTask);
        console.tron.log(`download should be finished to ${result.path()}`);
        yield put({
            type: OTA_DOWNLOAD_SUCCEEDED,
        });
        const state = yield select();
        logOTAAnalytics(state, 'firmware_download_succeeded');
    } catch (err) {
        console.tron.log(`Failed to download ${err}`);
        yield put({
            type: OTA_DOWNLOAD_FAILED,
            error: err,
        });
        const state = yield select();
        logOTAAnalytics(state, 'firmware_download_failed');
    }
}

function *cancelDownload(action) {
    try {
        yield apply(downloadTask, downloadTask.cancel);
    } catch (err) {
        console.tron.log(`failed to cancel download ${err}`);
    }
}

function *deleteDownload(action) {
    try {
        yield apply(RNFetchBlob, RNFetchBlob.fs.unlink, [filePath]);
    } catch (err) {
        console.tron.log(`failed to delete download ${err}`);
    }
}

function *startInstall(action) {
    // TODO: activate nordic library
}

function *cancelInstall(action) {
    // TODO: activate nordic library
}

const logOTAAnalytics = (state, event) => {
    Analytics.logEventWithAppState(event, {
        device_firmware_version: ConnectedDeviceStatusSelectors.getFirmwareVersion(state),
        server_firmware_version: OTASelectors.getFirmwareVersion(state),
    }, state);
};

export default OTASaga;