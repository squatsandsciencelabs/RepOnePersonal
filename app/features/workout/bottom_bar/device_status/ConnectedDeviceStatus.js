import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CONNECTED, RECONNECTING } from 'app/configs+constants/SensorStatus';
import * as Device from 'app/utility/Device';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';
import Localized from 'app/services/Localization';

class ConnectedDeviceStatus extends Component {
    _renderConnectedIcon() {
        const deviceName = this.props.deviceName;
        var img =
            getKratosEnabled() && deviceName.startsWith('Kratos')
                ? require('app/appearance/images/icon_connected_kratos.png')
                : require('app/appearance/images/icon_connected.png');

        return <Image style={styles.imageStyle} source={img} />;
    }

    render() {
        if (this.props.deviceStatus === CONNECTED) {
            var statusView = (
                <View style={styles.statusBar}>
                    {this._renderConnectedIcon()}
                    <Text style={[styles.textStyle, styles.pl7]}>
                        {this.props.deviceName}
                    </Text>
                    {this.props.batteryPercentage !== null && (
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
                                {this.props.batteryPercentage}%
                            </Text>
                        </View>
                    )}
                </View>
            );
        } else if (this.props.deviceStatus === RECONNECTING) {
            var statusView = (
                <View style={styles.statusBar}>
                    <Image
                        style={styles.imageStyle}
                        source={require('app/appearance/images/icon_disconnected.png')}
                    />
                    <Text style={[styles.textStyle, styles.pl7]}>
                        {Localized('CONNECTED_DEVICE_STATUS.RECONNECTING')}
                    </Text>
                </View>
            );
        } else {
            var statusView = (
                <View style={styles.statusBar}>
                    <Image
                        style={styles.imageStyle}
                        source={require('app/appearance/images/icon_disconnected.png')}
                    />
                    <Text style={[styles.textStyle, styles.pl7]}>
                        {Localized('CONNECTED_DEVICE_STATUS.NOT_CONNECTED')}
                    </Text>
                </View>
            );
        }

        return (
            <TouchableOpacity onPress={() => this.props.tappedDevice()}>
                {statusView}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    statusBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
        marginBottom: Device.hasNotch() ? 25 : 0,
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
