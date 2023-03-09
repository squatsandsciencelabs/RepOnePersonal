import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAReadyPanel extends Component {
    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { fontWeight: '500', marginTop: 10 },
                    ]}>
                    Version {this.props.firmwareVersion} installed
                </Text>
                <Image
                    style={{ marginTop: 10 }}
                    source={require('app/appearance/images/firmware_installation_succeeded.png')}
                />
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        {
                            textAlign: 'left',
                            color: 'gray',
                            marginTop: 30,
                        },
                    ]}>
                    The connected device is up to date. To update another RepOne
                    unit, connect to it below.
                </Text>
            </View>
        );
    }
}

export default SettingsOTAReadyPanel;
