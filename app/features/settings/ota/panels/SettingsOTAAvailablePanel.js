import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAAvailablePanel extends Component {

    render() {
        let deviceFirmwareText = <Text style={ styles.description }>Connect a RepOne Sensor to compare versions.</Text>;
        if (this.props.deviceFirmwareVersion) {
            deviceFirmwareText = <Text style={ styles.description }>The connected RepOne Sensor is <Text style={{fontWeight: "bold"}}>Version {this.props.deviceFirmwareVersion}</Text></Text>;
        }
        return (
            <View>
                <View style={{}}>
                    <Text style={ styles.description }>
                        <Text style={{fontWeight: "bold"}}>Version {this.props.firmwareVersion}</Text> {this.props.firmwareDescription}
                    </Text>
                </View>
                <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50, width: 200, marginTop: 10, marginBottom: 10}]}
                    onPress={this.props.download.bind(this)}>
                        <Text style={SETTINGS_PANEL_STYLES.buttonText}>Download Version {this.props.firmwareVersion}</Text>
                </TouchableOpacity>
                {deviceFirmwareText}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    description: {
        textAlign: 'left',
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 14,
        paddingTop: 10,
        paddingBottom: 10,
    },
});

export default SettingsOTAAvailablePanel;
