import { RECONNECTING } from 'app/configs+constants/SensorStatus';
import { kratosEnabled } from 'app/configs+constants/KratosConfig';

const stateRoot = (state) => state.connectedDevice;

// not memoizing as memoized would need to do 2 if checks (did status change)
// this has a single if check as well before returning values
// at worst it has to go down the reference chain a tad more
export const getConnectedDeviceStatus = (state) => {
    let root = stateRoot(state);
    if (root.isReconnecting) {
        return RECONNECTING;
    } else {
        return root.status;
    }
};

export const getIsReconnecting = (state) => stateRoot(state).isReconnecting;

export const getConnectedDeviceName = (state) => stateRoot(state).deviceName;

export const getConnectedDeviceIdentifier = (state) => stateRoot(state).deviceIdentifier;

export const getConnectedDeviceFamily = (state) => stateRoot(state).deviceFamily;

export const getNumDisconnects = (state) => stateRoot(state).numDisconnects;

export const getNumReconnects = (state) => stateRoot(state).numReconnects;

export const getFirmwareVersion = (state) => stateRoot(state).firmwareVersion;

export const getAPIFormatVersion = (state) => stateRoot(state).apiFormatVersion;

export const getCan3D = state => true; // getConnectedDeviceStatus(state) === 'CONNECTED'; // TODO: have this actually be set properly based on sensor capabilities

const RepOneCharacteristic = 'A5183278-CA65-45B7-B6C3-A68552F20273';
const KratosCharacteristic = 'A5183278-CA65-45B7-B6C3-A68552F20284';

export const getConnectedDeviceRepCharacteristic = state => {
    if (kratosEnabled) {
        return stateRoot(state).deviceFamily === 'KRATOS'
            ? KratosCharacteristic
            : RepOneCharacteristic;
    }

    return RepOneCharacteristic;
};

