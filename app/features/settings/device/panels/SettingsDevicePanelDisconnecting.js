import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

// displays disconnecting device info
class SettingsDevicePanelDisconnecting extends Component {
    render() {
        return (
            <View style={[SETTINGS_PANEL_STYLES.panel, { flex: 1 }]}>
                <View style={SETTINGS_PANEL_STYLES.header}>
                    <Text style={SETTINGS_PANEL_STYLES.headerText}>
                        {Localized('DISCONNECTING')}
                    </Text>
                </View>
                <View style={SETTINGS_PANEL_STYLES.content} />
                <View style={SETTINGS_PANEL_STYLES.footer} />
            </View>
        );
    }
}

export default SettingsDevicePanelDisconnecting;
