import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class SettingsOTADownloadFailedPanel extends Component {
    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { fontWeight: 'bold' },
                    ]}>
                    {Localized('DOWNLOAD_FAILED')}
                </Text>
                <Image
                    style={{ marginTop: 25, marginBottom: 25 }}
                    source={require('app/appearance/images/ota_failed.png')}
                />
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.tappableText,
                        { fontWeight: 'bold', paddingBottom: 7 },
                    ]}
                    onPress={this.props.download.bind(this)}>
                    {Localized('RETRY_DOWNLOAD')}
                </Text>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.footerCancelText,
                        {
                            paddingTop: 7,
                            paddingBottom: 10,
                            fontWeight: 'bold',
                        },
                    ]}
                    onPress={this.props.cancelDownload.bind(this)}>
                    {Localized('CANCEL')}
                </Text>
            </View>
        );
    }
}

export default SettingsOTADownloadFailedPanel;
