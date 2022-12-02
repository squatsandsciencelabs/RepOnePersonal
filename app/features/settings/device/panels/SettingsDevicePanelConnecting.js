import React, { Component } from 'react';
import {
    Text,
    View,
    Image
} from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';

// displays connecting device info
class SettingsDevicePanelConnecting extends Component {

    _renderConnectingIcon() {
        const device = this.props.device;
        var img =
            getKratosEnabled() && device.startsWith('Kratos')
                ? require('app/appearance/images/icon_bluetooth_kratos_connecting.png')
                : require('app/appearance/images/icon_bluetooth_connecting.png');

        return <Image source={img} />;
    }

    render() {
        return (
            <View style={ [SETTINGS_PANEL_STYLES.panel, { flex: 1 }] }>
                <View style={ SETTINGS_PANEL_STYLES.header }>
                    <Text style={ SETTINGS_PANEL_STYLES.headerText }>
                        Connecting to { this.props.device }...
                    </Text>
                </View>
                <View style={ SETTINGS_PANEL_STYLES.content }>
                    {this._renderConnectingIcon()}
                </View>
            </View>
        );
    }

}

export default SettingsDevicePanelConnecting;
