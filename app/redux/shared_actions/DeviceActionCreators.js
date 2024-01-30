// These exist in shared because the Bluetooth service needs access to them
// Services do not have "Actions" they're directly associated with, so they use the shared creator

import { Alert, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';

import {
    START_DEVICE_SCAN,
    STOP_DEVICE_SCAN,
    FOUND_DEVICE,
    BLUETOOTH_OFF,
    DISCONNECTED_FROM_DEVICE,
    CONNECTING_TO_DEVICE,
    CONNECTED_TO_DEVICE,
    ADD_REP_DATA,
    RECONNECTING_TO_DEVICE,
    DISCONNECT_DEVICE,
    CONNECT_DEVICE,
    RECONNECT_DEVICE,
    VELOCITY_DROPPED,
    ADD_KRATOS_REP_DATA,
    UPDATE_BATTERY_PERCENTAGE,
    RESTORED_BLE_STATE,
} from 'app/configs+constants/ActionTypes';
import {
    CONNECTING,
    CONNECTED,
    DISCONNECTING,
} from 'app/configs+constants/SensorStatus';
import * as TimerActionCreators from './TimerActionCreators';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as SettingsSelectors from 'app/redux/selectors/SettingsSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as Analytics from 'app/services/Analytics';
import * as ScannedDevicesSelectors from 'app/redux/selectors/ScannedDevicesSelectors';
import {
    check,
    PERMISSIONS,
    RESULTS,
    openSettings,
    requestMultiple,
} from 'react-native-permissions';
import * as BluetoothUtils from 'app/utility/BluetoothUtils';
import { DEVICE_SERVICE } from 'app/configs+constants/BluetoothAPI';

// SCANNING
export const startDeviceScan =
    (isManualScan = false) =>
    async (dispatch, getState) => {
        if (Platform.OS !== 'ios') {
            const permissions = BluetoothUtils.getBluetoothPermissionsAndroid();

            let allPermissionsGranted =
                await BluetoothUtils.areAllPermissionsGranted(permissions);

            const bleManagerStarted = BluetoothUtils.getDidBleManagerStart();

            if (!isManualScan && !allPermissionsGranted) {
                return;
            }

            if (
                (!isManualScan &&
                    allPermissionsGranted &&
                    !bleManagerStarted) ||
                (isManualScan && allPermissionsGranted && !bleManagerStarted)
            ) {
                try {
                    await BleManager.start({ showAlert: false });
                    BluetoothUtils.setDidBleManagerStart(true);
                } catch (err) {
                    console.tron.log(
                        `start device scan failed to start blemanager ${JSON.stringify(
                            err,
                        )}`,
                    );
                }
            }

            if (isManualScan && !allPermissionsGranted) {
                await requestMultiple(permissions);

                allPermissionsGranted =
                    await BluetoothPermissionsUtils.areAllPermissionsGranted(
                        permissions,
                    );

                if (!allPermissionsGranted) {
                    Alert.alert(
                        'RepOne would like to use Bluetooth for discovering devices',
                        'You can allow RepOne to use Bluetooth in Settings.',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Open Settings',
                                style: 'default',
                                onPress: openSettings,
                            },
                        ],
                    );
                    return;
                } else {
                    try {
                        await BleManager.start({ showAlert: false });
                        BluetoothUtils.setDidBleManagerStart(true);
                    } catch (err) {
                        console.tron.log(
                            `start device scan failed to start blemanager ${JSON.stringify(
                                err,
                            )}`,
                        );
                    }
                }
            }
        }

        if (BluetoothUtils.getDidBleManagerStart() === false) {
            // sanity check start failed, exit
            console.tron.log(`start device scan failed to start blemanager`);
            const state = getState();
            logFailedAttemptScanAnalytics(state, isManualScan);
        } else {
            // scan for device service as all devices should have it
            BleManager.scan([DEVICE_SERVICE], 99999, false);
            const state = getState();
            logAttemptScanAnalytics(state, isManualScan);

            dispatch({
                type: START_DEVICE_SCAN,
                isManualScan: isManualScan,
            });
        }
    };

export const stopDeviceScan = () => (dispatch, getState) => {
    BleManager.stopScan();

    const state = getState();
    logCompletedScanAnalytics(state);

    dispatch({
        type: STOP_DEVICE_SCAN,
    });
};

export const foundDevice = (deviceName, deviceIdentifier) => ({
    type: FOUND_DEVICE,
    deviceName,
    deviceIdentifier,
});

// DEVICE

export const connectDevice =
    (deviceName, deviceIdentifier) => (dispatch, getState) => {
        BleManager.connect(deviceIdentifier); // TODO: should this be device?
        const state = getState();
        logAttemptConnectDeviceAnalytics(false, state);
        dispatch(connectingToDevice(deviceName, deviceIdentifier));

        dispatch({
            type: CONNECT_DEVICE,
            deviceName,
            deviceIdentifier,
        });
    };

export const reconnectDevice =
    (deviceName, deviceIdentifier) => (dispatch, getState) => {
        const state = getState();
        logAttemptConnectDeviceAnalytics(true, state);

        BleManager.connect(deviceIdentifier); // TODO: should this be device?
        console.tron.log(
            `reconnect device called with ${deviceName} and ${deviceIdentifier}`,
        );
        dispatch(connectingToDevice(deviceName, deviceIdentifier));

        dispatch({
            type: RECONNECT_DEVICE,
            deviceName,
            deviceIdentifier,
        });
    };

export const disconnectDevice =
    (performAction = true) =>
    (dispatch, getState) => {
        const state = getState();
        const deviceId =
            ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(state);
        if (!deviceId) {
            // TODO: error handling
            // TODO: confirm this, it might clear the reducer too fast, and if so I'll need another way to grab the id to disconnect from the peripheral
            // places to check are:
            // 1. reconnect canceling
            // 2. settings cancel connecting
            // 3. settings cancel after connecdted
            // 4. turning off power should not call this
            console.tron.log(
                `unable to disconnect device as no device id saved in reducer`,
            );
            return;
        }

        BleManager.disconnect(deviceId);

        if (performAction) {
            dispatch({
                type: DISCONNECT_DEVICE,
                deviceId,
            });
        }
    };

// DEVICE STATUS

export const bluetoothIsOff = () => ({
    type: BLUETOOTH_OFF,
});

export const disconnectedFromDevice =
    (name = null, deviceIdentifier = null) =>
    (dispatch, getState) => {
        Analytics.setUserProp('connected_device_id', null);
        Analytics.setUserProp('device_version', null);

        const state = getState();
        const deviceStatus =
            ConnectedDeviceStatusSelectors.getConnectedDeviceStatus(state);
        if (deviceStatus === CONNECTED || deviceStatus === DISCONNECTING) {
            const isIntentional = deviceStatus === DISCONNECTING;
            logDisconnectedFromDeviceAnalytics(isIntentional, state);
        }

        dispatch({
            type: DISCONNECTED_FROM_DEVICE,
            deviceName: name,
            deviceIdentifier,
        });
    };

// TODO: i need to ensure identifier is passed in, right now it's just the name
export const connectingToDevice = (name, deviceIdentifier) => ({
    type: CONNECTING_TO_DEVICE,
    deviceName: name,
    deviceIdentifier,
});

// TODO: this may not be able to receive the name, may want to pull from selector and just live with that for analytics??
export const connectedToDevice =
    (
        deviceIdentifier,
        apiFormatVersion,
        firmwareVersion,
        initialBatteryPercentage,
    ) =>
    (dispatch, getState) => {
        // analytics
        const state = getState();
        const name =
            ConnectedDeviceStatusSelectors.getConnectedDeviceName(state); // rely on name from "connecting"
        console.tron.log(
            `got name ${name} and trying to set user prop with it`,
        );
        Analytics.setUserProp('connected_device_name', name);
        Analytics.setUserProp('connected_device_id', deviceIdentifier);
        Analytics.setUserProp('firmware_version', firmwareVersion);

        // TODO: get firmware and log that here
        logConnectedToDeviceAnalytics(state);

        dispatch({
            type: CONNECTED_TO_DEVICE,
            deviceName: name,
            deviceIdentifier,
            apiFormatVersion,
            firmwareVersion,
            initialBatteryPercentage,
        });
    };

export const reconnectingToDevice = name => {
    return {
        type: RECONNECTING_TO_DEVICE,
        deviceName: name,
    };
};

export const updateBatteryPercentage = percentage => {
    return {
        type: UPDATE_BATTERY_PERCENTAGE,
        percentage,
    };
};

// DATA

export const receivedLiftData =
    (data, time = new Date()) =>
    (dispatch, getState) => {
        const state = getState();

        logAddRepAnalytics(state);

        dispatch(TimerActionCreators.sanityCheckTimer());
        dispatch({
            ...data,
            type: ADD_REP_DATA,
            deviceName:
                ConnectedDeviceStatusSelectors.getConnectedDeviceName(state),
            deviceIdentifier:
                ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(
                    state,
                ),
            firmwareVersion:
                ConnectedDeviceStatusSelectors.getFirmwareVersion(state),
            time: time,
        });
        dispatch(TimerActionCreators.startEndSetTimer());
    };

export const receivedKratosLiftData =
    (json, time = new Date()) =>
    (dispatch, getState) => {
        const state = getState();

        logAddRepAnalytics(state);

        dispatch(TimerActionCreators.sanityCheckTimer());
        dispatch({
            ...json,
            type: ADD_KRATOS_REP_DATA,
            deviceName:
                ConnectedDeviceStatusSelectors.getConnectedDeviceName(state),
            deviceIdentifier:
                ConnectedDeviceStatusSelectors.getConnectedDeviceIdentifier(
                    state,
                ),
            firmwareVersion:
                ConnectedDeviceStatusSelectors.getFirmwareVersion(state),
            time: time,
            kratosAutoDeleteReps:
                SettingsSelectors.getKratosAutoDeleteRepCount(state),
        });

        dispatch(TimerActionCreators.startEndSetTimer());
    };

export const restoredBLEState = () => (dispatch, getState) => {
    dispatch({
        type: RESTORED_BLE_STATE,
    });
};

// ANALYTICS

const logAddRepAnalytics = state => {
    const currentSet = SetsSelectors.getWorkingSet(state);
    let set_id = currentSet.setID;
    let rep_count = currentSet.reps.length;
    let has_exercise_name = Boolean(currentSet.exercise);
    let has_weight = Boolean(currentSet.weight);
    let has_rpe = Boolean(currentSet.rpe);
    let has_tags = Boolean(currentSet.tags.length);
    let has_video = Boolean(currentSet.videoFileUrl);
    let has_reps = Boolean(SetsSelectors.getNumWorkoutReps(state));
    let end_set_time_left = SettingsSelectors.getEndSetTimeLeft(state);

    Analytics.logEventWithAppState(
        'add_rep',
        {
            set_id: set_id,
            rep_count: rep_count,
            has_exercise_name: has_exercise_name,
            has_weight: has_weight,
            has_rpe: has_rpe,
            has_tags: has_tags,
            has_video: has_video,
            has_reps: has_reps,
            end_set_time_left: end_set_time_left,
        },
        state,
    );
};

const logAttemptScanAnalytics = (state, isManualScan) => {
    Analytics.logEventWithAppState(
        'attempt_scan',
        {
            is_manual: isManualScan,
        },
        state,
    );
};

const logFailedAttemptScanAnalytics = (state, isManualScan) => {
    Analytics.logEventWithAppState(
        'failed_attempt_scan',
        {
            is_manual: isManualScan,
        },
        state,
    );
};

const logCompletedScanAnalytics = state => {
    const isManualScan = ScannedDevicesSelectors.getIsManualScan(state);
    const manualScannedNone =
        ScannedDevicesSelectors.getManualScannedNone(state);

    Analytics.logEventWithAppState(
        'completed_scan',
        {
            is_manual: isManualScan,
            manual_scanned_none: manualScannedNone,
        },
        state,
    );
};

const logAttemptConnectDeviceAnalytics = (isReconnect, state) => {
    Analytics.logEventWithAppState(
        'attempt_connect_device',
        {
            is_reconnect: isReconnect,
        },
        state,
    );
};

const logConnectedToDeviceAnalytics = state => {
    Analytics.logEventWithAppState('connected_to_device', {}, state);
};

const logConnectedToDeviceTimedOutAnalytics = (isReconnect, state) => {
    Analytics.logEventWithAppState(
        'connect_to_device_timed_out',
        {
            is_reconnect: isReconnect,
        },
        state,
    );
};

const logDisconnectedFromDeviceAnalytics = (isIntentional, state) => {
    Analytics.logEventWithAppState(
        'disconnected_from_device',
        {
            is_intentional: isIntentional,
        },
        state,
    );
};
