import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

// displays connected device info, allows disconnect from device
class SettingsDevicePanelBluetoothOff extends Component {
    render() {
        return (
            <View style={[SETTINGS_PANEL_STYLES.panel, { flex: 1 }]}>
                <View style={SETTINGS_PANEL_STYLES.header}>
                    <Text style={SETTINGS_PANEL_STYLES.headerText}>
                        {Localized('TAP_UNIT_TO_CONNECT')}
                    </Text>
                </View>
                <View style={SETTINGS_PANEL_STYLES.content}>
                    <Text style={SETTINGS_PANEL_STYLES.footerCancelText}>
                        {Localized('ENABLE_BLUETOOTH_MESSAGE')}
                    </Text>
                </View>
                <View style={SETTINGS_PANEL_STYLES.footer} />
            </View>
        );
    }
}

export default SettingsDevicePanelBluetoothOff;
