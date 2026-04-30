import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SafeModal from 'app/shared_features/safe_modal/SafeModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export default function VideoPlayer(props) {
    const insets = useSafeAreaInsets();

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

    function renderVideo() {
        if (!props.isModalShowing) return null;

        const topOffset = insets.top + 10;

        return (
            <View style={[{ flex: 1 }, styles.container]}>
                {props.video && (
                    <Video
                        style={{ flex: 1 }}
                        source={{ uri: props.video }}
                        paused={false}
                        resizeMode="contain"
                        repeat={true}
                    />
                )}

                <View style={[styles.cancelButton, { top: topOffset }]}>
                    <TouchableOpacity
                        onPress={() => props.closeModal(props.setID)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.deleteButton, { top: topOffset }]}>
                    <TouchableOpacity
                        onPress={() => props.deleteVideo(props.setID)}>
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <SafeModal visible={props.isModalShowing} statusColor="black">
            {renderVideo()}
        </SafeModal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    cancelButton: {
        position: 'absolute',
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
    deleteButton: {
        position: 'absolute',
        right: 20,
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
