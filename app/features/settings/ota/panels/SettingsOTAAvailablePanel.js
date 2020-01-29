import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAAvailablePanel extends Component {

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
                    <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50}]}
                        onPress={this.props.download.bind(this)}>
                            <Text style={SETTINGS_PANEL_STYLES.buttonText}>Download Version {this.props.firmwareVersion}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

export default SettingsOTAAvailablePanel;
