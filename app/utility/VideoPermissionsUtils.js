import { Alert, Platform } from 'react-native';
import { check, PERMISSIONS } from 'react-native-permissions';
import * as Analytics from 'app/services/Analytics';
import Device from 'react-native-device-info';

const ANDROID_VERSION = Number(Device.getSystemVersion());

const ANDROID_STORAGE_ACCESS_MAX_VERSION = 9;

const requiresExternalStoragePermission = () => {
    if (Number.isNaN(ANDROID_VERSION)) return true;

    return ANDROID_VERSION <= ANDROID_STORAGE_ACCESS_MAX_VERSION;
};

export const checkWatchVideoPermissions = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = null;
            if (Platform.OS === 'ios') {
                response = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
            } else {
                if (!requiresExternalStoragePermission()) {
                    response = 'granted';
                } else {
                    response = await check(
                        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                    );
                }
            }

            if (response === 'granted') {
                console.tron.log(`granted watch video`);
                resolve();
            } else {
                if (Platform.OS === 'ios') {
                    var message =
                        'RepOne needs Photo permissions to play videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
                } else {
                    var message =
                        'RepOne needs Storage permissions to play videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
                }
                Alert.alert(
                    'Additional Permissions Required',
                    message,
                    [{ text: 'OK' }],
                    { cancelable: false },
                );
                Analytics.logEvent('watch_video_permissions_warning', {});
                reject();
            }
        } catch (err) {
            // TODO: proper analytics for straight up failure, might be crashlytics?
            console.tron.log(`Error checking storage permissions ${err}`);
            Alert.alert(
                'Additional Permissions Required',
                'There was an error accessing your photo storage to play videos',
                [{ text: 'OK' }],
                { cancelable: false },
            );
            reject();
        }
    });
};

export const checkRecordingPermissions = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = null;
            if (Platform.OS === 'ios') {
                response = await Promise.all([
                    check(PERMISSIONS.IOS.PHOTO_LIBRARY),
                    check(PERMISSIONS.IOS.MICROPHONE),
                    check(PERMISSIONS.IOS.CAMERA),
                ]);
            } else {
                response = await Promise.all([
                    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE),
                    check(PERMISSIONS.ANDROID.RECORD_AUDIO),
                    check(PERMISSIONS.ANDROID.CAMERA),
                ]);
            }
            const isStorageAuthorized = requiresExternalStoragePermission()
                ? response[0] === 'granted'
                : true;
            const isMicrophoneAuthorized = response[1] === 'granted';
            const isCameraAuthorized = response[2] === 'granted';
            if (
                isCameraAuthorized &&
                isMicrophoneAuthorized &&
                isStorageAuthorized
            ) {
                console.tron.log(`granted record`);
                resolve();
            } else {
                console.tron.log(`wtf ${JSON.stringify(response)}`);
                Alert.alert(
                    'Additional Permissions Required',
                    recordingPermissionsErrorMessage(
                        isCameraAuthorized,
                        isMicrophoneAuthorized,
                        isStorageAuthorized,
                    ),
                    [{ text: 'OK' }],
                    { cancelable: false },
                );
                // TODO: should put it in the catch so can pass in state
                Analytics.logEvent('record_video_permissions_warning', {});
                reject();
            }
        } catch (err) {
            // TODO: proper analytics for straight up failure, might be crashlytics?
            console.tron.log(`Error checking recording permissions ${err}`);
            reject();
        }
    });
};

const recordingPermissionsErrorMessage = (
    isCameraAuthorized,
    isMicrophoneAuthorized,
    isStorageAuthorized,
) => {
    if (isCameraAuthorized && isMicrophoneAuthorized && isStorageAuthorized) {
        return null;
    }
    if (isCameraAuthorized && isMicrophoneAuthorized) {
        if (Platform.OS === 'ios') {
            return 'RepOne needs Photo permissions to store videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
        } else {
            return 'RepOne needs Storage permissions to store videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
        }
    }
    if (isMicrophoneAuthorized && isStorageAuthorized) {
        return 'RepOne needs Camera permissions to record videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
    }
    if (isCameraAuthorized && isStorageAuthorized) {
        return 'RepOne needs Microphone permissions to record videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
    }
    if (isCameraAuthorized) {
        if (Platform.OS === 'ios') {
            return 'RepOne needs Microphone and Photos permissions to record and store videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
        } else {
            return 'RepOne needs Microphone and Storage permissions to record and store videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
        }
    }
    if (isMicrophoneAuthorized) {
        if (Platform.OS === 'ios') {
            return 'RepOne needs Camera and Photos permissions to record and store videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
        } else {
            return 'RepOne needs Camera and Storage permissions to record and store videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
        }
    }
    if (isStorageAuthorized) {
        return 'RepOne needs Camera and Microphone permissions to record videos on your phone.\n\nPlease enable them for RepOne in your phone Settings';
    }
    return null;
};
