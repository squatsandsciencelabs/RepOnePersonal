import { RECONNECTING } from 'app/configs+constants/SensorStatus';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';
import {
    REP_ONE_TETHER_REP_SERVICE,
    REP_ONE_TETHER_REP_SUMMARY_CHARACTERISTIC,
    KRATOS_REP_SERVICE,
    KRATOS_REP_SUMMARY_CHARACTERISTIC,
} from 'app/configs+constants/BluetoothAPI';

const stateRoot = state => state.connectedDevice;

// not memoizing as memoized would need to do 2 if checks (did status change)
// this has a single if check as well before returning values
// at worst it has to go down the reference chain a tad more
export const getConnectedDeviceStatus = state => {
    let root = stateRoot(state);
    if (root.isReconnecting) {
        return RECONNECTING;
    } else {
        return root.status;
    }
};

export const getIsReconnecting = state => stateRoot(state).isReconnecting;

export const getConnectedDeviceName = state => stateRoot(state).deviceName;

export const getConnectedDeviceIdentifier = state =>
    stateRoot(state).deviceIdentifier;

export const getConnectedDeviceFamily = state => stateRoot(state).deviceFamily;

export const getNumDisconnects = state => stateRoot(state).numDisconnects;

export const getNumReconnects = state => stateRoot(state).numReconnects;

export const getFirmwareVersion = state => stateRoot(state).firmwareVersion;

export const getAPIFormatVersion = state => stateRoot(state).apiFormatVersion;

export const getCan3D = state => true; // getConnectedDeviceStatus(state) === 'CONNECTED'; // TODO: have this actually be set properly based on sensor capabilities

export const getConnectedDeviceRepService = state => {
    if (getKratosEnabled()) {
        return stateRoot(state).deviceFamily === 'KRATOS'
            ? KRATOS_REP_SERVICE
            : REP_ONE_TETHER_REP_SERVICE;
    }

    return REP_ONE_TETHER_REP_SERVICE;
};

export const getConnectedDeviceRepCharacteristic = state => {
    if (getKratosEnabled()) {
        return stateRoot(state).deviceFamily === 'KRATOS'
            ? KRATOS_REP_SUMMARY_CHARACTERISTIC
            : REP_ONE_TETHER_REP_SUMMARY_CHARACTERISTIC;
    }

    return REP_ONE_TETHER_REP_SUMMARY_CHARACTERISTIC;
};

export const getConnectedDeviceBatteryPercentage = state =>
    stateRoot(state).batteryPercentage;

export const getIsBLEStateRestored = state => stateRoot(state).isStateRestored;
