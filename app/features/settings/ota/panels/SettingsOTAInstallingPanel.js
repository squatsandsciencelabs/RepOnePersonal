import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAInstallingPanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                    Version {this.props.firmwareVersion} files downloaded
                </Text>
                <ActivityIndicator color="#4F4F4F" />
                <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                    Installing on RepOne {this.props.connectedDevice}
                </Text>
                <Text style={SETTINGS_PANEL_STYLES.footerCancelText} onPress={this.props.cancelInstall.bind(this)}>
                    Cancel
                </Text>
            </View>
        );
    }

}

export default SettingsOTAInstallingPanel;
