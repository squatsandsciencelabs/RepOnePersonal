import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAInstallingPanel extends Component {

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
                    <ActivityIndicator color="#4F4F4F" />
                    <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                        Installing on RepOne {this.props.connectedDevice}
                    </Text>
                    <Text style={SETTINGS_PANEL_STYLES.footerCancelText} onPress={this.props.cancelInstall.bind(this)}>
                        Cancel
                    </Text>
                </View>
            </View>
        );
    }

}

export default SettingsOTAInstallingPanel;
