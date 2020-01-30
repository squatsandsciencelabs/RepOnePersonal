import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAInstallFailedPanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, { fontWeight: 'bold' }] }>
                    Version {this.props.firmwareVersion} files downloaded
                </Text>

                <Image style={{ marginTop:25, marginBottom:25 }} source={require('app/appearance/images/ota_failed.png')} />
                <Text style={ SETTINGS_PANEL_STYLES.footerCancelText }>
                    Error installing on {this.props.connectedDevice}
                </Text>
                <Text style={[SETTINGS_PANEL_STYLES.tappableText, {fontWeight: 'bold', paddingTop: 30, paddingBottom: 10}]} onPress={this.props.install.bind(this)}>
                    Retry installation
                </Text>
                <Text style={[SETTINGS_PANEL_STYLES.tappableText, {paddingTop: 10, paddingBottom: 15, fontWeight: 'bold'}]} onPress={this.props.deleteDownload.bind(this)}>
                    I'm done, delete update files
                </Text>
             </View>
        );
    }

}

export default SettingsOTAInstallFailedPanel;
