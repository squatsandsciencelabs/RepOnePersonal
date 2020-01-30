import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAAvailablePanel extends Component {

    render() {
        return (
            <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50, width: 200}]}
                onPress={this.props.download.bind(this)}>
                    <Text style={SETTINGS_PANEL_STYLES.buttonText}>Download Version {this.props.firmwareVersion}</Text>
            </TouchableOpacity>
        );
    }

}

export default SettingsOTAAvailablePanel;
