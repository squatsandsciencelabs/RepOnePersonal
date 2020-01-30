import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTADownloadFailedPanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                    Download Failed
                </Text>
                <Image source={require('app/appearance/images/icon_disconnected.png')} />
                <Text style={SETTINGS_PANEL_STYLES.tappableText} onPress={this.props.download.bind(this)}>
                    Retry download
                </Text>
                <Text style={SETTINGS_PANEL_STYLES.footerCancelText} onPress={this.props.cancelDownload.bind(this)}>
                    Cancel
                </Text>
            </View>
        );
    }

}

export default SettingsOTADownloadFailedPanel;
