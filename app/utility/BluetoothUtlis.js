import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

var didBleManagerStart = false;

export const getDidBleManagerStart = () => didBleManagerStart;

export const setDidBleManagerStart = value => {
    didBleManagerStart = value;
};

export const getBluetoothPermissionsAndroid = () => {
    if (Platform.OS !== 'ios') {
        const apiLevel = Platform.Version;

        const permissions =
            apiLevel >= 31
                ? [
                      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                  ]
                : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
        return permissions;
    }
    return null;
};

export const checkBluetoothPermissionsAndroid = async () => {
    if (Platform.OS !== 'ios') {
        const permissions = getBluetoothPermissionsAndroid();

        const allPermissionsGranted = await areAllPermissionsGranted(
            permissions,
        );
        return allPermissionsGranted;
    }
    return null;
};

// HELPERS

const asyncEvery = async (arr, predicate) => {
    for (let e of arr) {
        if (!(await predicate(e))) return false;
    }
    return true;
};

export const areAllPermissionsGranted = async permissions =>
    await asyncEvery(permissions, async permission => {
        const permissionStatus = await check(permission);
        return permissionStatus === RESULTS.GRANTED;
    });
