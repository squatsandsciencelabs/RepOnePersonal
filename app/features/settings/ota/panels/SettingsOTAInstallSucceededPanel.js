import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAInstallSucceededPanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, { fontWeight: 'bold' }] }>
                    Version {this.props.firmwareVersion} files downloaded
                </Text>
                <Image style={{ marginTop:25, marginBottom:25 }} source={require('app/appearance/images/ota_succeeded.png')} />
                <Text style={ [SETTINGS_PANEL_STYLES.footerCancelText, {color: 'green'}] }>
                    Version {this.props.firmwareVersion} is installed on RepOne {this.props.connectedDevice}
                </Text>
                <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, {textAlign: 'left', paddingTop: 15, paddingBottom: 10}] }>
                    To install on another RepOne unit, connect to it below.
                </Text>
                <Text style={[SETTINGS_PANEL_STYLES.tappableText, {fontWeight: 'bold', paddingTop: 15, paddingBottom: 10}]} onPress={this.props.deleteDownload.bind(this)}>
                    I'm done, delete update files
                </Text>
            </View>
        );
    }

}

export default SettingsOTAInstallSucceededPanel;
