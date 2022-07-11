import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import CameraRoll from "@react-native-community/cameraroll";
import ReactNativeBlobUtil from 'react-native-blob-util';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import * as Device from 'app/utility/Device';
import Icon from 'react-native-vector-icons/FontAwesome';

// NOTE: possible that can promisify setTimeout, but not sure it's available in RN so just hacking it for speed
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function record(props, camera) {
    console.tron.log(`function record called, attempting camera.current.startrecording`);
    camera.current.startRecording({
        onRecordingFinished: async (video) => {
            try {
                // delay another second, see if that resolves anything
                await delay(1000);

                // save to gallery
                console.tron.log(`recording finished, attempting to save to camera roll`);
                const uri = await CameraRoll.save(video.path);

                // delete from cache
                console.tron.log(`recording finished to uri ${uri}, attempting to delete from cache`);
                await ReactNativeBlobUtil.fs.unlink(video.path);

                // dispatch info
                if (props.setID) {
                    console.tron.log(`recording finished, sending save video action for set ${props.setID} uri ${uri} and video type ${props.videoType}`);
                    props.saveVideo(props.setID, uri, props.videoType);
                } else {
                    console.tron.log(`no props.setID set ${props.setID}, cannot pass along saveVideo with uri ${uri} and video type ${props.videoType}`);
                }
            } catch (err) {
                console.tron.log(`error on recording stuff, ${err}`);
                props.saveVideoError(props.setID, err);
            }
        },
        onRecordingError: (err) => {
            let error = err;
            if (!(err instanceof Error)) {
                error = new Error(err.message, {cause: err.cause});
            }
            console.tron.log(`onRecordingError attempting to send action for set ${props.setID} err ${JSON.stringify(error)}`);
            props.saveVideoError(props.setID, error);
            console.tron.log(`onRecordingError, alerting message`);
            Alert.alert('There was an issue saving your video. Please try again');
        },
    });
    console.tron.log(`function record finished, recording should be in progress`);
}

// TODO: look for a better place to store the timer
// Just wasn't sure that timer could be declared within useEffect as it runs every time isRecording changes
let timer = null;

export default (props) => {
    const camera = useRef(null);
    const devices = useCameraDevices(`wide-angle-camera`);
    const device = devices[props.cameraType];
    useEffect(() => {
        if (props.isRecording) {
            // start recording now
            console.tron.log(`props isRecording just changed to ${props.isRecording}, attempting to begin recording`);
            record(props, camera);
        } else if (props.isModalShowing) {
            // stop recording if it's showing, as otherwise it's a cancel
            
            if (Platform.OS === 'ios') {
                console.tron.log(`modal is showing ${props.isModalShowing}, attempt to stop recording after a delay due to iOS issues`);
                // TODO: remove timer hack, this was necessary to prevent weird behavior when ending too quickly
                timer = setTimeout(() => {
                    if (camera && camera.current) {
                        console.tron.log(`timer finished, calling camera.current.stopRecording`);
                        camera.current.stopRecording();
                    } else {
                        console.tron.log(`timer finished, but no camera exists so cannot stop recording`);
                    }
                    clearTimeout(timer);
                    timer = null;
                    console.tron.log(`cleared timer used to delay ending recording`);
                }, 1000);
            } else {
                console.tron.log(`modal is showing ${props.isModalShowing}, attempt to stop recording immediately for Android`);
                this.camera.stopRecording();
            }
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
                console.tron.log(`unmounting camera, cleared timer`);
            } else {
                console.tron.log(`unmounting camera, no timer to clear`);
            }
        };
    }, [props.isRecording]);
    if (device == null) return null;
    return (
        <Modal visible={props.isModalShowing} animationType='fade'>
            {renderCamera(props, camera, device)}
        </Modal>
    );
};

function renderCamera(props, camera, device) {
    if (props.isModalShowing === false || !device) {
        console.tron.log(`deactivate keep awake`);
        deactivateKeepAwake();
        return null;
    }
    console.tron.log(`activate keep awaie`);
    activateKeepAwake();

    return (<View style={[{ flex: 1 }, styles.container]}>
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
                <TouchableOpacity onPress={() => {
                    if (!timer) {
                        console.tron.log(`closing modal for set ${props.setID}`);
                        props.closeModal(props.setID);
                        console.tron.log(`closed modal for set ${props.setID}`);
                    } else {
                        console.tron.log(`denie canceling video recordering, timer is still active ${timer}`);
                    }
                }}>
                    <View><Text style={styles.cancelText}>Cancel</Text></View>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' }}>
            {renderActionButton(props)}
        </View>

        {renderToggleCameraTypeButton(props)}
    </View>);
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
        return <View></View>
    } else {
        return (
            <View style={styles.flipButton}>
                <TouchableOpacity onPress={() => props.toggleCameraType()}>
                    <View>
                        <Icon name="repeat" size={30} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, borderRadius: 22.5, overflow: 'hidden' }} color='white' />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black'
    },
    actionButton: {
        width: 70,
        height: 70,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    startButton: {
        backgroundColor: 'green',
    },
    stopButton: {
        backgroundColor: 'red',
    },
    savingButton: {
        backgroundColor: 'darkgray'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        position: 'absolute',
        top: Device.isiPhoneX() ? 50 : 30,
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
        textAlign: 'center'
    },
    flipButton: {
        alignItems: 'flex-end',
        marginRight: 20,
        backgroundColor: '#00000000',
        position: 'absolute',
        bottom: 60,
        right: 0
    },
    flipIcon: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 22.5,
        overflow: 'hidden',
    },
});
