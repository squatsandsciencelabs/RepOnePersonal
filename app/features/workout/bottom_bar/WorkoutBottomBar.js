// TODO: disabled state for end workout

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConnectedDeviceStatusScreen from './device_status/ConnectedDeviceStatusScreen';

function WorkoutBottomBar(props) {
    const insets = useSafeAreaInsets();

    const _onPressEndWorkout = () => {
        props.endWorkout();
    };

    const message = 'FINISH WORKOUT';

    const barStyle = {
        ...styles.bar,
        height: 50 + insets.bottom,
    };

    const buttonTextStyle = {
        ...styles.buttonText,
        marginBottom: insets.bottom,
    };

    return (
        <View style={barStyle}>
            <ConnectedDeviceStatusScreen />
            <TouchableOpacity
                style={{ justifyContent: 'center' }}
                onPress={_onPressEndWorkout}>
                <Text style={buttonTextStyle}>{message}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch', // stretch to take full height
        justifyContent: 'space-between', // center text vertically
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(47, 128, 237, 1)',
        position: 'absolute',
        padding: 0,
    },
    buttonText: {
        color: 'white',
        marginRight: 20,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default WorkoutBottomBar;
