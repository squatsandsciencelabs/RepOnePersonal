import React, { Component } from 'react';
import {
    Text,
    View,
    Image
} from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import { kratosEnabled } from 'app/configs+constants/KratosConfig';

// displays connected device info, allows disconnect from device
class SettingsDevicePanelConnected extends Component {

    _renderConnectedIcon() {
        const device = this.props.device;
        var img =
            kratosEnabled && device.startsWith('Kratos')
                ? require('app/appearance/images/icon_bluetooth_kratos_connected.png')
                : require('app/appearance/images/icon_bluetooth_connected.png');

        return <Image source={img} />;
    }

    render() {
        // hide disconnect mid install to prevent the weird bugs
        const disconnectOption = this.props.isInstalling ? null : <View style={ SETTINGS_PANEL_STYLES.footer }>
            <Text style={ SETTINGS_PANEL_STYLES.footerCancelText }
                onPress={ () => this.props.disconnectDevice() }>
                DISCONNECT
            </Text>
        </View>;

        return (
            <View style={ [SETTINGS_PANEL_STYLES.panel, { flex: 1 }] }>
                <View style={ SETTINGS_PANEL_STYLES.header }>
                    <Text style={ SETTINGS_PANEL_STYLES.headerText }>
                        Connected to { this.props.device }
                    </Text>
                </View>
                <View style={SETTINGS_PANEL_STYLES.content}>
                    {this._renderConnectedIcon()}
                </View>
                {disconnectOption}
            </View>
        );
    }

}

export default SettingsDevicePanelConnected;