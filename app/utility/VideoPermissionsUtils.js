import { Alert, Platform } from 'react-native';
import { check, PERMISSIONS } from 'react-native-permissions';
import * as Analytics from 'app/services/Analytics';
import Device from 'react-native-device-info';
import Localized from 'app/services/Localization';

const ANDROID_VERSION = Number(Device.getSystemVersion());

const ANDROID_STORAGE_ACCESS_MAX_VERSION = 9;

const requiresExternalStoragePermission = () => {
    if (Number.isNaN(ANDROID_VERSION)) {
        return true;
    }

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
                console.tron.log('granted watch video');
                resolve();
            } else {
                if (Platform.OS === 'ios') {
                    var message = Localized(
                        'PERMISSIONS_MODAL.PLAY_VIDEOS_PHOTO_MESSAGE',
                    );
                } else {
                    var message = Localized(
                        'PERMISSIONS_MODAL.PLAY_VIDEOS_STORAGE_MESSAGE',
                    );
                }
                Alert.alert(
                    Localized('PERMISSIONS_MODAL.TITLE'),
                    message,
                    [{ text: Localized('PERMISSIONS_MODAL.SUBMIT') }],
                    { cancelable: false },
                );
                Analytics.logEvent('watch_video_permissions_warning', {});
                reject();
            }
        } catch (err) {
            // TODO: proper analytics for straight up failure, might be crashlytics?
            console.tron.log(`Error checking storage permissions ${err}`);
            Alert.alert(
                Localized('PERMISSIONS_MODAL.TITLE'),
                Localized('PERMISSIONS_MODAL.PLAY_VIDEOS_ERROR_MESSAGE'),
                [{ text: Localized('PERMISSIONS_MODAL.SUBMIT') }],
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
                console.tron.log('granted record');
                resolve();
            } else {
                console.tron.log(`wtf ${JSON.stringify(response)}`);
                Alert.alert(
                    Localized('PERMISSIONS_MODAL.TITLE'),
                    recordingPermissionsErrorMessage(
                        isCameraAuthorized,
                        isMicrophoneAuthorized,
                        isStorageAuthorized,
                    ),
                    [{ text: Localized('PERMISSIONS_MODAL.SUBMIT') }],
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
            return Localized('PERMISSIONS_MODAL.STORE_VIDEOS_PHOTO_MESSAGE');
        } else {
            return Localized('PERMISSIONS_MODAL.STORE_VIDEOS_STORAGE_MESSAGE');
        }
    }
    if (isMicrophoneAuthorized && isStorageAuthorized) {
        return Localized('PERMISSIONS_MODAL.RECORD_VIDEOS_CAMERA_MESSAGE');
    }
    if (isCameraAuthorized && isStorageAuthorized) {
        return Localized('PERMISSIONS_MODAL.RECORD_VIDEOS_MICROPHONE_MESSAGE');
    }
    if (isCameraAuthorized) {
        if (Platform.OS === 'ios') {
            return Localized(
                'PERMISSIONS_MODAL.RECORD_STORE_VIDEOS_MICROPHONE_PHOTOS_MESSAGE',
            );
        } else {
            return Localized(
                'PERMISSIONS_MODAL.RECORD_STORE_VIDEOS_MICROPHONE_STORAGE_MESSAGE',
            );
        }
    }
    if (isMicrophoneAuthorized) {
        if (Platform.OS === 'ios') {
            return Localized(
                'PERMISSIONS_MODAL.RECORD_STORE_VIDEOS_CAMERA_PHOTOS_MESSAGE',
            );
        } else {
            return Localized(
                'PERMISSIONS_MODAL.RECORD_STORE_VIDEOS_CAMERA_STORAGE_MESSAGE',
            );
        }
    }
    if (isStorageAuthorized) {
        return Localized(
            'PERMISSIONS_MODAL.RECORD_STORE_VIDEOS_CAMERA_MICROPHONE_MESSAGE',
        );
    }
    return null;
};
