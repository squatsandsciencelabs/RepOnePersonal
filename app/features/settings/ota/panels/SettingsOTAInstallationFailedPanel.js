import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import { cancelInstall } from '../SettingsOTAActions';

class SettingsOTADownloadFailedPanel extends Component {
    _handleRetryPress() {
        this.props.install();
    }

    _handleCancelPress() {
        this.props.cancelInstall();
    }

    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        SETTINGS_PANEL_STYLES.redText,
                        { fontWeight: '500' },
                    ]}>
                    Version {this.props.firmwareVersion} installation failed
                </Text>
                <Image
                    style={{ marginVertical: 25 }}
                    source={require('app/appearance/images/ota_failed.png')}
                />
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.tappableText,
                        { fontWeight: '500' },
                    ]}
                    onPress={this._handleRetryPress}>
                    Retry
                </Text>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.footerCancelText,
                        {
                            paddingTop: 25,
                            paddingBottom: 10,
                            fontWeight: '500',
                        },
                    ]}
                    onPress={this._handleCancelPress}>
                    Cancel
                </Text>
            </View>
        );
    }
}

export default SettingsOTADownloadFailedPanel;
