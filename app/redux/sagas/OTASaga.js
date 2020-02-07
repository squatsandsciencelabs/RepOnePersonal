import {
    takeEvery,
    put,
    apply,
    all,
    call,
    select,
} from 'redux-saga/effects';
import RNFetchBlob from 'rn-fetch-blob';
import { NordicDFU, DFUEmitter } from "react-native-nordic-dfu";

import { 
    CONFIG_READY,
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
import firebase from 'app/services/Firebase';
import * as Analytics from 'app/services/Analytics';
import * as OTASelectors from 'app/redux/selectors/OTASelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';

let downloadTask = null;
const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/firmware.zip`; // TODO: set the correct filepath for iOS and Android so it doesn't get killed by temp directory

export default function * OTASaga() {
    yield all([
        takeEvery(CONFIG_READY, checkOTA),
        takeEvery(OTA_DOWNLOAD_ATTEMPT, startDownload),
        takeEvery(CANCEL_OTA_DOWNLOAD, cancelDownload),
        takeEvery(DELETE_OTA_DOWNLOAD, deleteDownload),
        takeEvery(INSTALL_OTA_ATTEMPT, startInstall),
        takeEvery(CANCEL_INSTALL_OTA, cancelInstall),
    ]);
};

function *checkOTA(action) {
   if (!action.activated) {
        console.tron.log("Fetched data not activated");
        // NOTE: not logging this as it appears to still work regardless of activation?
        // state = yield select();
        // logUpdateSurveyURLErrorAnalytics(state, 'fetched data not activated');
    }

    // get url
    const fbconfig = firebase.config();
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
        return;
    }

    // default to available
    yield put({
        type: OTA_DOWNLOAD_AVAILABLE,
        firmwareVersion,
    });
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
        const result = yield downloadTask;

        console.tron.log(`download should be finished to ${result.path()}`);
        yield put({
            type: OTA_DOWNLOAD_SUCCEEDED,
        });
        const state = yield select();
        logOTAAnalytics(state, 'firmware_download_succeeded');
    } catch (err) {
        console.tron.log(`Failed to download ${(err)}`);
        if (err.message !== 'canceled') {
            yield put({
                type: OTA_DOWNLOAD_FAILED,
                error: err,
            });
            const state = yield select();
            logOTAAnalytics(state, 'firmware_download_failed');
        }
    }
}

function *cancelDownload(action) {
    try {
        yield apply(downloadTask, downloadTask.cancel);
        yield apply(RNFetchBlob, RNFetchBlob.fs.unlink, [filePath]);
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
    try {
        const deviceIdentifier = yield select(ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier);

        yield apply(NordicDFU, NordicDFU.startDFU, [{
            deviceAddress: deviceIdentifier, // TODO: this i need to handle differently for iOS and Android and needs testing
            filePath,
        }]);
        const state = yield select();
        logOTAAnalytics(state, 'firmware_install_succeeded');

        // check if software can handle it
        // TODO: ideally this should be handled by a saga, but unfortunately the bluetooth layer is not saga based
        const response = yield apply(BleManager, BleManager.read, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F3026D', 'A5183278-CA65-45B7-B6C3-A68552F3026E']);
        const typedArray = new Uint8Array(response);
        const data16 = new Uint16Array(typedArray.buffer);
        if (data16[0] > 1) {
            console.tron.log(`api version mismatch`);
            Alert.alert(`Please update your RepOne app to use this device.`);
        }
        yield put({
            type: INSTALL_OTA_SUCCEEDED,
            apiFormatVersion: data16[0],
            firmwareVersion: `${data16[1]}.${data16[2]}.${data16[3]}`,
        });
    } catch (err) {
        console.tron.log(`failed to install ${err}`);
        yield put({
            type: INSTALL_OTA_FAILED,
        });
        const state = yield select();
        logOTAAnalytics(state, 'firmware_install_failed');
    }
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
