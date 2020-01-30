import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTADownloadingPanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                    Downloading Version {this.props.firmwareVersion}
                </Text>
                <ActivityIndicator color="#4F4F4F" />
                <Text style={SETTINGS_PANEL_STYLES.footerCancelText} onPress={this.props.cancelDownload.bind(this)}>
                    Cancel
                </Text>
            </View>
        );
    }

}

export default SettingsOTADownloadingPanel;
