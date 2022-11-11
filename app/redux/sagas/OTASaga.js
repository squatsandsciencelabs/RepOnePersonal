import {
    takeEvery,
    put,
    apply,
    all,
    select,
} from 'redux-saga/effects';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { NordicDFU, DFUEmitter } from "react-native-nordic-dfu";
import { Alert, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';
import DeviceInfo from 'react-native-device-info';

import {
    STORE_INITIALIZED,
    OTA_UPDATE_APP_REQUIRED,
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
import { isVersionLessThanOrEqual, isVersionGreaterThanOrEqual } from 'app/math/VersionComparison';

let downloadTask = null;
// TODO: set the correct filepath for iOS and Android so it doesn't get killed by temp directory
const filePath =`${ReactNativeBlobUtil.fs.dirs.DocumentDir}/firmware.zip`;

export default function* OTASaga(dispatch) {
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

function* checkOTA(dispatch, action) {
    // listen for dfu
    DFUEmitter.addListener("DFUProgress", ({ percent }) => {
        dispatch({
            type: INSTALL_OTA_PROGRESS,
            progress: percent,
        });
    });
    DFUEmitter.addListener("DFUStateChanged", ({ state }) => {
        console.tron.log(`DFU state: ${state}`);
        dispatch({
            type: INSTALL_OTA_DFU_STATE_CHANGED,
            state,
        });
    });

    // get json from server 
    let json = null;
    try {
        const response = yield fetch(OpenBarbellConfig.firmwareURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
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

    // get firmware version / description
    let needsUpgrade = false;
    let firmwareVersion = null;
    let firmwareDescription = null;
    try {
        const appVersion = DeviceInfo.getVersion();
        const osVersion = DeviceInfo.getSystemVersion();
        const result = checkFirmwareUpdates(appVersion, osVersion, json);
        if (result === null) {
            console.tron.log(`Firmware version checked failed, result was null`);
            return;
        } else {
            needsUpgrade = result.updateApp;
            firmwareVersion = result.firmwareVersion;
            firmwareDescription = json.firmware_descriptions[firmwareVersion];
            console.tron.log(`Received firmware check for app ${appVersion} os ${osVersion} as ${firmwareVersion} with description ${firmwareDescription} and upgrade ${needsUpgrade}`);
        }
    } catch (err) {
        console.tron.log(`Firmware version check failed, ${err}`);
        return;
    }

    // handle result
    if (needsUpgrade) {
        // demand upgrade
        yield put({
            type: OTA_UPDATE_APP_REQUIRED,
            firmwareVersion,
            firmwareDescription,
        });
    } else {
        // show firmware version

        // check version against disk
        const currentVersion = yield select(OTASelectors.getFirmwareVersion);
        if (currentVersion !== firmwareVersion) {
            try {
                // NOTE: This always runs as you aren't connected to a sensor at startup, so currentVersion defaults to 0.0.1
                // Leaving it as it's fine
                console.tron.log(`deleting on disk as curr ${currentVersion} !== firm ${firmwareVersion}`);
                yield apply(ReactNativeBlobUtil, ReactNativeBlobUtil.fs.unlink, [filePath]);
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
        const exists = yield apply(ReactNativeBlobUtil, ReactNativeBlobUtil.fs.exists, [filePath]);
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
}

function* startDownload(action) {
    try {
        const currentVersion = yield select(OTASelectors.getFirmwareVersion);
        downloadTask = ReactNativeBlobUtil
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

function* cancelDownload(action) {
    try {
        yield apply(downloadTask, downloadTask.cancel);
        yield apply(ReactNativeBlobUtil, ReactNativeBlobUtil.fs.unlink, [filePath]);
    } catch (err) {
        console.tron.log(`failed to cancel download ${err}`);
    }
}

function* deleteDownload(action) {
    try {
        yield apply(ReactNativeBlobUtil, ReactNativeBlobUtil.fs.unlink, [filePath]);
    } catch (err) {
        console.tron.log(`failed to delete download ${err}`);
    }
}

function* startInstall(action) {
    const state = yield select();
    const deviceIdentifier = ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
    const name = ConnectedDeviceStatusSelectors.getConnectedDeviceName(state);
    const repCharacteristic = ConnectedDeviceStatusSelectors.getConnectedDeviceRepCharacteristic(state);

    try {
        yield apply(BleManager, BleManager.stopNotification, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', repCharacteristic]); // reps
        if (OpenBarbellConfig.bulkEnabled) {
            yield apply(BleManager, BleManager.stopNotification, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274']); // bulk data
        }
        const path = Platform.OS === 'ios' ? `file://${filePath}` : filePath;
        yield apply(NordicDFU, NordicDFU.startDFU, [{
            deviceAddress: deviceIdentifier, // TODO: this i need to handle differently for iOS and Android and needs testing
            filePath: path,
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
                yield apply(BleManager, BleManager.startNotification, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', repCharacteristic]); // reps
                if (OpenBarbellConfig.bulkEnabled) {
                    yield apply(BleManager, BleManager.startNotification, [deviceIdentifier, 'A5183278-CA65-45B7-B6C3-A68552F2026D', 'A5183278-CA65-45B7-B6C3-A68552F20274']); // bulk data
                }
            } catch (err) {
                console.tron.log(`Error attempting to restart rep notifications after failed dfu ${err}`);
            }
        } else {
            console.tron.log(`ignore installation failure as this is a reboot`);
        }
    }
}

function* reboot(action) {
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
        
        // disconnect attempt due to somehow it not disconnecting post reboot
        // NOTE: NOT going through device action creators disconnect as I actually want it to reconnect
        const deviceIdentifier = ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
        try {
            yield apply(BleManager, BleManager.disconnect, [deviceIdentifier]);
        } catch (err) {
            console.tron.log(`Error attempt to disconnect during reboot ${err}`);
        }
    }
}

function* cancelInstall(action) {
    // TODO: activate nordic library
}

const logOTAAnalytics = (state, event) => {
    Analytics.logEventWithAppState(event, {
        device_firmware_version: ConnectedDeviceStatusSelectors.getFirmwareVersion(state),
        server_firmware_version: OTASelectors.getFirmwareVersion(state),
    }, state);
};

// version helpers

const compareFirmwareVersions = (appVersion, json) => {
    let index = 0;
    for (let firmware_config of json.firmware_updates) {
        if (!firmware_config.min_app_version && !firmware_config.max_app_version) {
            console.tron.log(`check firmware updates error, cannot process lack of min or max app version`);
            return null;
        }

        if (firmware_config.min_app_version) {
            if (!isVersionGreaterThanOrEqual(appVersion, firmware_config.min_app_version)) {
                // no good
                index++;
                continue;
            }
        }
        if (firmware_config.max_app_version) {
            if (!isVersionLessThanOrEqual(appVersion, firmware_config.max_app_version)) {
                // no good
                index++;
                continue;
            }
        }

        // passed
        return {
            firmwareVersion: firmware_config.firmware_version,
            index,
        };
    }

    // safety check, should never happen
    return null;
};

// returns any of the following
// - firmware version to display, so the string
// - app update, so "true"
// - nothing because there was an issue, null
const checkFirmwareUpdates = (appVersion, osVersion, json) => {
    // basic check
    let result = compareFirmwareVersions(appVersion, json);
    if (result === null) {
        return null;
    }
    const firmwareVersion = result.firmwareVersion;
    const index = result.index;

    if (index === 0) {
        // you are latest, bueno
        return {
            firmwareVersion,
            updateApp: false,
        };
    } else {
        // you are not latest, see if upgrading the app is possible
        let nextAppVersion = null;
        const appUpdateArray = Platform.OS === 'ios' ? json.app_updates.ios : json.app_updates.android;
        for (let app_config of appUpdateArray) {
            if (!app_config.min_os_version && !app_config.max_os_version) {
                console.tron.log(`check firmware updates error, cannot process lack of min and max os`);
                return null;
            }

            if (app_config.min_os_version) {
                if (!isVersionGreaterThanOrEqual(osVersion, app_config.min_os_version)) {
                    // no good
                    continue;
                }
            }
            if (app_config.max_os_version) {
                if (!isVersionLessThanOrEqual(osVersion, app_config.max_os_version)) {
                    // no good
                    continue;
                }
            }

            // passed
            nextAppVersion = app_config.app_version;
            break;
        }

        result = compareFirmwareVersions(nextAppVersion, json);
        if (result === null) {
            return null;
        } else if (result.firmwareVersion !== firmwareVersion) {
            // upgrade app
            return {
                firmwareVersion,
                updateApp: true,
            };
        } else {
            // same firmware version, just spit that one out
            return {
                firmwareVersion,
                updateApp: false,
            };
        }
    }
};
