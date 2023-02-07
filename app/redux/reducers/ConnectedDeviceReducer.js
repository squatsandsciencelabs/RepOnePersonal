import {
    CONNECT_DEVICE,
    RECONNECT_DEVICE,
    STOP_RECONNECT,
    DISCONNECT_DEVICE,
    BLUETOOTH_OFF,
    DISCONNECTED_FROM_DEVICE,
    CONNECTING_TO_DEVICE,
    CONNECTED_TO_DEVICE,
    RECONNECTING_TO_DEVICE,
    END_WORKOUT,
    UPDATE_BATTERY_PERCENTAGE,
} from 'app/configs+constants/ActionTypes';
import {
    DEVICE_BLUETOOTH_OFF,
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    DISCONNECTING,
    RECONNECTING,
} from 'app/configs+constants/SensorStatus';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';

const defaultState = {
    status: DISCONNECTED,
    deviceName: null,
    deviceIdentifier: null,
    deviceFamily: null,
    isReconnecting: false,
    numDisconnects: 0,
    numReconnects: 0,
    apiFormatVersion: null,
    firmwareVersion: null,
    batteryPercentage: null,
};

const ConnectedDeviceReducer = (state = defaultState, action) => {
    switch (action.type) {
        case CONNECT_DEVICE:
            return Object.assign({}, state, {
                status: CONNECTING,
                deviceName: action.deviceName,
                deviceIdentifier: action.deviceIdentifier,
            });
        case RECONNECT_DEVICE:
            return Object.assign({}, state, {
                status: CONNECTING,
                deviceName: action.deviceName,
                deviceIdentifier: action.deviceIdentifier,
                numReconnects: state.numReconnects + 1,
            });
        case DISCONNECT_DEVICE:
            // TODO: confirm if there's an issue here with disconnecting from the device
            // It's possible that the disconnect fails and removing the device name and identifier here could cause an issue
            // For now, setting to null on disconnect to differentiate between manual disconnect and other disconnects
            return Object.assign({}, state, {
                status: DISCONNECTING,
                deviceName: null,
                deviceIdentifier: null,
                batteryPercentage: null,
            });
        case BLUETOOTH_OFF:
            return Object.assign({}, state, {
                status: DEVICE_BLUETOOTH_OFF,
                deviceName: null,
                deviceIdentifier: null,
                batteryPercentage: null,
            });
        case DISCONNECTED_FROM_DEVICE:
            return Object.assign({}, state, {
                status: DISCONNECTED,
                deviceName: null,
                deviceIdentifier: null,
                numDisconnects: action.deviceName
                    ? state.numDisconnects + 1
                    : state.numDisconnects, // TODO: need to test this
                apiFormatVersion: null,
                firmwareVersion: null,
                batteryPercentage: null,
            });
        case STOP_RECONNECT:
            return Object.assign({}, state, {
                status: DISCONNECTED,
                deviceName: null,
                deviceIdentifier: null,
                isReconnecting: false,
                batteryPercentage: null,
            });
        case CONNECTING_TO_DEVICE:
            return {
                ...state,
                status: CONNECTING,
                deviceName: action.deviceName,
                deviceIdentifier: action.deviceIdentifier,
            };
        case CONNECTED_TO_DEVICE:
            return Object.assign({}, state, {
                status: CONNECTED,
                deviceName: action.deviceName,
                deviceIdentifier: action.deviceIdentifier,
                deviceFamily: getKratosEnabled()
                    ? action.deviceName.startsWith('Kratos')
                        ? 'KRATOS'
                        : 'REP_ONE'
                    : 'REP_ONE', // TODO: have this be from device info instead of string parsing from the name
                isReconnecting: false,
                apiFormatVersion: action.apiFormatVersion,
                firmwareVersion: action.firmwareVersion,
                batteryPercentage: action.batteryPercentage,
            });
        case RECONNECTING_TO_DEVICE:
            return Object.assign({}, state, {
                isReconnecting: true,
            });
        case END_WORKOUT:
            return Object.assign({}, state, {
                numReconnects: 0,
                numDisconnects: 0,
            });
        case UPDATE_BATTERY_PERCENTAGE:
            return { ...state, batteryPercentage: action.percentage };
        default:
            return state;
    }
};

export default ConnectedDeviceReducer;
