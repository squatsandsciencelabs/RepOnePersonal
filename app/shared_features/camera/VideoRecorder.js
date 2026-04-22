import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    StatusBar,
} from 'react-native';
import SafeModal from 'app/shared_features/safe_modal/SafeModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

function record(props, camera) {
    camera.current.startRecording({
        onRecordingFinished: async video => {
            try {
                // save to gallery
                const uri = await CameraRoll.save(video.path);
                // Note: can't delete the video file from cache as it's stored in the readonly tmp folder
                // After each app reload the tmp folder is cleared so shouldn't cause problems

                // dispatch info
                if (props.setID) {
                    props.saveVideo(props.setID, uri, props.videoType);
                }
            } catch (err) {
                console.tron.log(`error on recording stuff, ${err}`);
                props.saveVideoError(props.setID, err);
            }
        },
        onRecordingError: err => {
            let error = err;
            if (!(err instanceof Error)) {
                error = new Error(err.message, { cause: err.cause });
            }
            console.tron.log(`onRecordingError ${JSON.stringify(error)}`);
            props.saveVideoError(props.setID, error);
            Alert.alert(
                'There was an issue saving your video. Please try again',
            );
        },
    });
}

// TODO: look for a better place to store the timer
// Just wasn't sure that timer could be declared within useEffect as it runs every time isRecording changes
let timer = null;

export default props => {
    const camera = useRef(null);

    // Try to use wide-angle camera first, fallback to default if not available
    // In v4, useCameraDevice automatically handles device selection
    const wideAngleDevice = useCameraDevice(props.cameraType, {
        physicalDevices: ['wide-angle-camera'],
    });
    const defaultDevice = useCameraDevice(props.cameraType);

    // If there is no wide-angle-camera, use the default one
    const device = wideAngleDevice || defaultDevice;

    useEffect(() => {
        if (props.isRecording) {
            // start recording now
            record(props, camera);
        } else if (props.isModalShowing) {
            // stop recording if it's showing, as otherwise it's a cancel

            if (Platform.OS === 'ios') {
                // TODO: remove timer hack, this was necessary to prevent weird behavior when ending too quickly
                timer = setTimeout(() => {
                    if (camera && camera.current) {
                        camera.current.stopRecording();
                    }
                    clearTimeout(timer);
                    timer = null;
                }, 1000);
            } else {
                camera.current.stopRecording();
            }
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };
    }, [props.isRecording]);

    useEffect(() => {
        if (props.isModalShowing) {
            activateKeepAwakeAsync();
        } else {
            deactivateKeepAwake();
        }
        return () => {
            deactivateKeepAwake();
        };
    }, [props.isModalShowing]);

    if (device == null) return null;
    return (
        <SafeModal visible={props.isModalShowing}>
            <StatusBar barStyle="light-content" />
            {renderCamera(props, camera, device)}
        </SafeModal>
    );
};

function renderCamera(props, camera, device) {
    if (props.isModalShowing === false || !device) {
        return null;
    }

    return (
        <SafeAreaView style={[{ flex: 1 }, styles.container]}>
            <Camera
                ref={camera}
                style={{ flex: 1 }}
                device={device}
                video={true}
                audio={true}
                isActive={true}
            />
            <View style={styles.cancelButton}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            if (!timer) {
                                props.closeModal(props.setID);
                            }
                        }}>
                        <View>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                }}>
                {renderActionButton(props)}
            </View>

            {renderToggleCameraTypeButton(props)}
        </SafeAreaView>
    );
}

function renderActionButton(props) {
    if (props.isSaving) {
        return (
            <View style={[styles.actionButton, styles.savingButton]}>
                <Text style={styles.buttonText}>SAVING</Text>
            </View>
        );
    } else if (props.isRecording) {
        return (
            <TouchableOpacity onPress={() => props.tappedStop()}>
                <View style={[styles.actionButton, styles.stopButton]}>
                    <Text style={styles.buttonText}>END</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity onPress={() => props.tappedStart(props.setID)}>
                <View style={[styles.actionButton, styles.startButton]}>
                    <Text style={styles.buttonText}>START</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

function renderToggleCameraTypeButton(props) {
    // need to return empty view as button remains but is not clickable if not returning anything
    if (props.isRecording || props.isSaving) {
        return <View></View>;
    } else {
        return (
            <View style={styles.flipButton}>
                <TouchableOpacity onPress={() => props.toggleCameraType()}>
                    <View>
                        <FontAwesome
                            name="repeat"
                            size={30}
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                padding: 10,
                                borderRadius: 22.5,
                                overflow: 'hidden',
                            }}
                            color="white"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    actionButton: {
        width: 70,
        height: 70,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startButton: {
        backgroundColor: 'green',
    },
    stopButton: {
        backgroundColor: 'red',
    },
    savingButton: {
        backgroundColor: 'darkgray',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        width: 100,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    cancelText: {
        color: 'white',
        fontWeight: 'bold',
        width: 50,
        height: 30,
        paddingTop: 5,
        textAlign: 'center',
    },
    flipButton: {
        alignItems: 'flex-end',
        marginRight: 20,
        backgroundColor: '#00000000',
        position: 'absolute',
        bottom: 60,
        right: 0,
    },
    flipIcon: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 22.5,
        overflow: 'hidden',
    },
});
