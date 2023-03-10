import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAAvailablePanel extends Component {
    _handleDownloadPress() {
        this.props.download();
    }

    render() {
        let deviceFirmwareText = (
            <Text style={styles.description}>
                There is an updated firmware available with new features and
                fixes. The connected RepOne hardware is version{' '}
                {this.props.deviceFirmwareVersion}.
            </Text>
        );

        return (
            <View>
                {deviceFirmwareText}
                <TouchableOpacity
                    style={[
                        SETTINGS_PANEL_STYLES.blueButton,
                        {
                            height: 40,
                            marginTop: 25,
                            alignSelf: 'flex-start',
                        },
                    ]}
                    onPress={this._handleDownloadPress}>
                    <Text
                        style={[
                            SETTINGS_PANEL_STYLES.buttonText,
                            styles.installButtonText,
                        ]}>
                        Install version {this.props.firmwareVersion}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    description: {
        textAlign: 'left',
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 14,
        paddingTop: 15,
        paddingBottom: 10,
    },
    installButton: {
        marginTop: 25,
    },
    installButtonText: {
        fontSize: 14,
        paddingHorizontal: 14,
    },
});

export default SettingsOTAAvailablePanel;
