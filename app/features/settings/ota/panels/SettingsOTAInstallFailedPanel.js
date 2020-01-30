import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAInstallFailedPanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                    Version {this.props.firmwareVersion} files downloaded
                </Text>
                <Image source={require('app/appearance/images/icon_disconnected.png')} />
                <Text style={ SETTINGS_PANEL_STYLES.footerCancelText }>
                    Error installing on {this.props.connectedDevice}
                </Text>
                <Text style={SETTINGS_PANEL_STYLES.tappableText} onPress={this.props.install.bind(this)}>
                    Retry installation
                </Text>
                <Text style={SETTINGS_PANEL_STYLES.tappableText} onPress={this.props.deleteDownload.bind(this)}>
                    I'm done, delete update files
                </Text>
            </View>
        );
    }

}

export default SettingsOTAInstallFailedPanel;
