import React, { Component } from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class SettingsOTAInstallingPanel extends Component {
    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { fontWeight: 'bold' },
                    ]}>
                    {Localized('DOWNLOADED_VERSION', {
                        version: this.props.firmwareVersion,
                    })}
                </Text>
                <Progress.Circle
                    style={{ marginTop: 10, marginBottom: 10 }}
                    size={50}
                    progress={this.props.progress}
                    showsText={true}
                    borderWidth={0}
                    unfilledColor={'#D4D4D4'}
                />
                <Text style={SETTINGS_PANEL_STYLES.subtitleText}>
                    {Localized('INSTALLING_ON_DEVICE', {
                        device: this.props.connectedDevice,
                    })}
                </Text>
                {/* <Text style={[SETTINGS_PANEL_STYLES.footerCancelText, {fontWeight: 'bold', paddingTop: 25, paddingBottom: 10}]} onPress={this.props.cancelInstall.bind(this)}>
                    Cancel
                </Text> */}
            </View>
        );
    }
}

export default SettingsOTAInstallingPanel;
