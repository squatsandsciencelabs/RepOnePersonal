import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class SettingsOTAReadyPanel extends Component {
    render() {
        const install =
            this.props.connectedDevice && this.props.deviceFirmwareVersion ? (
                <View>
                    <TouchableOpacity
                        style={[
                            SETTINGS_PANEL_STYLES.blueButton,
                            { height: 50, marginTop: 12, marginBottom: 16 },
                        ]}
                        onPress={this.props.install.bind(this)}>
                        <Text style={SETTINGS_PANEL_STYLES.buttonText}>
                            {Localized('INSTALL_ON_DEVICE', {
                                device: this.props.connectedDevice,
                            })}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={[
                            SETTINGS_PANEL_STYLES.subtitleText,
                            { textAlign: 'left' },
                        ]}>
                        {Localized('CONNECTED_REPONE_DEVICE')}{' '}
                        <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
                            {Localized('SENSOR_VERSION', {
                                version: this.props.deviceFirmwareVersion,
                            })}
                        </Text>
                    </Text>
                    <Text
                        style={[
                            SETTINGS_PANEL_STYLES.subtitleText,
                            {
                                textAlign: 'left',
                                color: 'gray',
                                fontSize: 13,
                                marginTop: 3,
                            },
                        ]}>
                        {Localized('INSTALL_ON_ANOTHER_REPONE_DEVICE_MESSAGE')}
                    </Text>
                </View>
            ) : (
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        {
                            textAlign: 'left',
                            color: 'gray',
                            fontSize: 13,
                            paddingTop: 10,
                            paddingBottom: 15,
                        },
                    ]}>
                    {Localized('INSTALL_ON_REPONE_DEVICE_MESSAGE')}
                </Text>
            );

        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { fontWeight: 'bold' },
                    ]}>
                    {Localized('VERSION_FILES_DOWNLOADED', {
                        version: this.props.firmwareVersion,
                    })}
                </Text>

                {install}
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.tappableText,
                        {
                            fontWeight: 'bold',
                            paddingTop: 15,
                            paddingBottom: 10,
                        },
                    ]}
                    onPress={this.props.deleteDownload.bind(this)}>
                    {Localized('DELETE_UPDATED_FILES')}
                </Text>
            </View>
        );
    }
}

export default SettingsOTAReadyPanel;
