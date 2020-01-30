import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTADownloadFailedPanel extends Component {

    render() {
        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ [SETTINGS_PANEL_STYLES.subtitleText, { fontWeight: 'bold' }] }>
                    Download Failed
                </Text>
                <Image style={{ marginTop:25, marginBottom:25 }} source={require('app/appearance/images/ota_failed.png')} />
                <Text style={[SETTINGS_PANEL_STYLES.tappableText, {fontWeight: 'bold', paddingBottom: 7}]} onPress={this.props.download.bind(this)}>
                    Retry download
                </Text>
                <Text style={[SETTINGS_PANEL_STYLES.footerCancelText, {paddingTop: 7, paddingBottom: 10, fontWeight: 'bold'}]} onPress={this.props.cancelDownload.bind(this)}>
                    Cancel
                </Text>
            </View>
        );
    }

}

export default SettingsOTADownloadFailedPanel;
