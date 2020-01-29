import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAInstallFailedPanel extends Component {

    // TODO: bold the version numbers
    render() {
        const deviceFirmwareText = this.props.deviceFirmwareVersion ? `The connected RepOne unit is version ${this.props.deviceFirmwareVersion}` : 'Connect a device to compare versions';
        return (
            <View style={ [SETTINGS_PANEL_STYLES.panel, { flex: 1 }] }>
                <View style={ SETTINGS_PANEL_STYLES.header }>
                    <Text style={ SETTINGS_PANEL_STYLES.headerText }>
                        Update Firmware
                    </Text>
                </View>
                <View style={ SETTINGS_PANEL_STYLES.content }>
                    <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                        The latest version is {this.props.firmwareVersion}
                    </Text>
                    <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                        {deviceFirmwareText}
                    </Text>
                </View>
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
            </View>
        );
    }

}

export default SettingsOTAInstallFailedPanel;
