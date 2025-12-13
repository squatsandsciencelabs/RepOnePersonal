import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONNECTED, RECONNECTING } from 'app/configs+constants/SensorStatus';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';

function ConnectedDeviceStatus(props) {
    const insets = useSafeAreaInsets();

    const _renderConnectedIcon = () => {
        const deviceName = props.deviceName;
        var img =
            getKratosEnabled() && deviceName.startsWith('Kratos')
                ? require('app/appearance/images/icon_connected_kratos.png')
                : require('app/appearance/images/icon_connected.png');

        return <Image style={styles.imageStyle} source={img} />;
    };

    const statusBarStyle = {
        ...styles.statusBar,
        marginBottom: insets.bottom,
    };

    if (props.deviceStatus === CONNECTED) {
        var statusView = (
            <View style={statusBarStyle}>
                {_renderConnectedIcon()}
                <Text style={[styles.textStyle, styles.pl7]}>
                    {props.deviceName}
                </Text>
                {props.batteryPercentage !== null && (
                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <Image
                            style={styles.imageStyle}
                            source={require('app/appearance/images/battery_percentage.png')}
                        />
                        <Text
                            style={[
                                styles.textStyle,
                                styles.batteryPercentage,
                            ]}>
                            {props.batteryPercentage}%
                        </Text>
                    </View>
                )}
            </View>
        );
    } else if (props.deviceStatus === RECONNECTING) {
        var statusView = (
            <View style={statusBarStyle}>
                <Image
                    style={styles.imageStyle}
                    source={require('app/appearance/images/icon_disconnected.png')}
                />
                <Text style={[styles.textStyle, styles.pl7]}>
                    RECONNECTING
                </Text>
            </View>
        );
    } else {
        var statusView = (
            <View style={statusBarStyle}>
                <Image
                    style={styles.imageStyle}
                    source={require('app/appearance/images/icon_disconnected.png')}
                />
                <Text style={[styles.textStyle, styles.pl7]}>
                    NOT CONNECTED
                </Text>
            </View>
        );
    }

    return (
        <TouchableOpacity onPress={() => props.tappedDevice()}>
            {statusView}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    statusBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
    },
    textStyle: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    pl7: {
        paddingLeft: 7,
    },
    imageStyle: {
        tintColor: 'white',
    },
    batteryPercentage: {
        marginLeft: 3.5,
    },
});

export default ConnectedDeviceStatus;
