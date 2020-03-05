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
import { Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';

import { 
    STORE_INITIALIZED,
    OTA_DOWNLOAD_READY,
    OTA_DOWNLOAD_AVAILABLE,
    OTA_DOWNLOAD_ATTEMPT,
    CANCEL_OTA_DOWNLOAD,
    OTA_DOWNLOAD_SUCCEEDED,
    OTA_DOWNLOAD_FAILED,
    DELETE_OTA_DOWNLOAD,

    INSTALL_OTA_PROGRESS,
    INSTALL_OTA_ATTEMPT,
    INSTALL_OTA_DFU_STATE_CHANGED,
    CANCEL_INSTALL_OTA,
} from 'app/configs+constants/ActionTypes';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';
import * as Analytics from 'app/services/Analytics';
import * as OTASelectors from 'app/redux/selectors/OTASelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';

let downloadTask = null;
const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/firmware.zip`; // TODO: set the correct filepath for iOS and Android so it doesn't get killed by temp directory

export default function * OTASaga(dispatch) {
    yield all([
        takeEvery(STORE_INITIALIZED, dispatch, checkOTA),
        takeEvery(OTA_DOWNLOAD_ATTEMPT, startDownload),
        takeEvery(CANCEL_OTA_DOWNLOAD, cancelDownload),
        takeEvery(DELETE_OTA_DOWNLOAD, deleteDownload),
        takeEvery(INSTALL_OTA_ATTEMPT, startInstall),
        takeEvery(INSTALL_OTA_DFU_STATE_CHANGED, reboot),
        takeEvery(CANCEL_INSTALL_OTA, cancelInstall),
    ]);
};

function *checkOTA(dispatch, action) {
    DFUEmitter.addListener("DFUProgress", ({ percent }) => {
        dispatch({
            type: INSTALL_OTA_PROGRESS,
            progress: percent,
        });
    });
    DFUEmitter.addListener("DFUStateChanged", ({ state }) => {
        console.tron.log("DFU state:", state);
        dispatch({
            type: INSTALL_OTA_DFU_STATE_CHANGED,
            state,
        });
    });

   if (!action.activated) {
        console.tron.log("Fetched data not activated");
        // NOTE: not logging this as it appears to still work regardless of activation?
        // state = yield select();
        // logUpdateSurveyURLErrorAnalytics(state, 'fetched data not activated');
    }

    // get url and description
    let json = null;
    try {
        const response = yield fetch(OpenBarbellConfig.firmwareURL);
        json = yield response.json();
        console.tron.log(`firmware url json ${JSON.stringify(json)}`);
    } catch (err) {
        console.tron.log(`DFU check failed ${err}`);
        return;
    }
    if (!json) {
        console.tron.log(`DFU check had null json`);
        return;
    }
    const firmwareVersion = json.version; 
    const firmwareDescription = json.description;

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
            firmwareDescription,
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
    const state = yield select();
    const deviceIdentifier = ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
    const name = ConnectedDeviceStatusSelectors.getConnectedDeviceName(state);

    try {
        yield apply(BleManager, BleManager.stopNotification, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20273'])
        yield apply(NordicDFU, NordicDFU.startDFU, [{
            deviceAddress: deviceIdentifier, // TODO: this i need to handle differently for iOS and Android and needs testing
            filePath,
        }]);
    } catch (err) {
        const state = yield select();
        if (OTASelectors.getProgress(state) !== 100) {
            // TODO: does this run before or after the reconnect saga hears from the disconnect?
            // if this runs before, it can technically set it to ready too quick and cause a double alert with reconnecting as it checks for installing state, not download ready
            console.tron.log(`failed to install ${err}`);
            Alert.alert(`Error installing firmware on ${name}`);
            logOTAAnalytics(state, 'firmware_install_failed');
            yield put({
                type: OTA_DOWNLOAD_READY,
            });
            try {
                yield apply(BleManager, BleManager.startNotification, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20273'])
            } catch(err) {
                console.tron.log(`Error attempting to restart rep notifications after failed dfu ${err}`);
            }
        } else {
            console.tron.log(`ignore installation failure as this is a reboot`);
        }
    }
}

function *reboot(action) {
    const state = yield select();
    const progress = OTASelectors.getProgress(state);
    if (progress === 100 && action.state === 'DEVICE_DISCONNECTING') {
        // success

        // analytics
        logOTAAnalytics(state, 'firmware_install_reboot');

        // alert
        Alert.alert(`Firmware uploaded, attempting to reboot device`);

        // TODO: problem, a disconnect is going to happen, this may cause a double alert because the reconnect checks for installing state, not download ready
        // change action
        yield put({
            type: OTA_DOWNLOAD_READY,
        });
    } else if (action.state === 'DFU_COMPLETED') {
        console.tron.log(`Firmware install success`);
        // Alert.alert(`Firmware successfully installed`);
        logOTAAnalytics(state, 'firmware_install_succeeded');
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
