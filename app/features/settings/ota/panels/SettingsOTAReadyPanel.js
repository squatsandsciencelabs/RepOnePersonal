import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAReadyPanel extends Component {

    render() {
        const install = this.props.connectedDevice ? (<View>
            <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50, marginTop: 12, marginBottom: 16 }]}
                onPress={this.props.install.bind(this)}>
                <Text style={SETTINGS_PANEL_STYLES.buttonText}>Install on RepOne #{this.props.connectedDevice}</Text>
            </TouchableOpacity>
            <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, {textAlign: 'left'}] }>
                The connected RepOne unit is <Text style={{fontWeight: "bold", fontSize: 13}}>Version {this.props.deviceFirmwareVersion}</Text>
            </Text>
            <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, {textAlign: 'left', color: 'gray', fontSize: 13, marginTop: 3}] }>
                To install on another RepOne unit, connect to it below.
            </Text>
        </View>) : (
            <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, {textAlign: 'left', color: 'gray', fontSize: 13, paddingTop: 10, paddingBottom: 15 }] }>
                To install on a RepOne unit, connect to it below.
            </Text>
        );

        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, { fontWeight: 'bold' }] }>
                    Version {this.props.firmwareVersion} files downloaded
                </Text>

                {install}
                <Text style={[SETTINGS_PANEL_STYLES.tappableText, {fontWeight: 'bold', paddingTop: 15, paddingBottom: 10}]} onPress={this.props.deleteDownload.bind(this)}>
                    I'm done, delete update files
                </Text>
            </View>
        );
    }

}

export default SettingsOTAReadyPanel;
