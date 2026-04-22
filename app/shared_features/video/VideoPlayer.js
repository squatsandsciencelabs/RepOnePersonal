// TODO: consider using react native video controls, which is already installed
// doing custom for now as some of the controls aren't working, specifically pause / play and I can't hide the full screen button

import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import SafeModal from 'app/shared_features/safe_modal/SafeModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

class VideoPlayer extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.isModalShowing !== prevProps.isModalShowing) {
            if (this.props.isModalShowing) {
                activateKeepAwakeAsync();
            } else {
                deactivateKeepAwake();
            }
        }
    }

    componentWillUnmount() {
        deactivateKeepAwake();
    }

    _renderVideo() {
        if (this.props.isModalShowing) {
            return (
                <SafeAreaView style={[{ flex: 1 }, styles.container]}>
                    {this.props.video && (
                        <Video
                            ref={ref => {
                                this.player = ref;
                            }}
                            style={[
                                { flex: 1 },
                                styles.button,
                                styles.blackButton,
                            ]}
                            source={{ uri: this.props.video }}
                            paused={false}
                            resizeMode="contain"
                            repeat={true}
                        />
                    )}

                    <View style={styles.cancelButton}>
                        <TouchableOpacity
                            onPress={() =>
                                this.props.closeModal(this.props.setID)
                            }>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.deleteButton}>
                        <TouchableOpacity
                            onPress={() =>
                                this.props.deleteVideo(this.props.setID)
                            }>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <SafeModal visible={this.props.isModalShowing}>
                <StatusBar barStyle="light-content" />
                {this._renderVideo()}
            </SafeModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    cancelButton: {
        position: 'absolute',
        left: 20,
        top: 10,
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
    deleteButton: {
        position: 'absolute',
        right: 20,
        top: 10,
        width: 100,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
        width: 50,
        height: 30,
        paddingTop: 5,
        textAlign: 'center',
    },
});

export default VideoPlayer;
