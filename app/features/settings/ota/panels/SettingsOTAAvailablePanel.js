import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAAvailablePanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50}]}
                    onPress={this.props.download.bind(this)}>
                        <Text style={SETTINGS_PANEL_STYLES.buttonText}>Download Version {this.props.firmwareVersion}</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

export default SettingsOTAAvailablePanel;
