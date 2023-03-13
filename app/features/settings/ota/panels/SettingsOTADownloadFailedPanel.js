import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTADownloadFailedPanel extends Component {
    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        SETTINGS_PANEL_STYLES.redText,
                        { fontWeight: '500' },
                    ]}>
                    Version {this.props.firmwareVersion} files failed to
                    download
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
                    onPress={this.props.download.bind(this)}>
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
                    onPress={this.props.cancelDownload.bind(this)}>
                    Cancel
                </Text>
            </View>
        );
    }
}

export default SettingsOTADownloadFailedPanel;
