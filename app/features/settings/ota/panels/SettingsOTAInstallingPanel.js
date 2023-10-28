import React, { Component } from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

// TODO: show kratos or repone then #
class SettingsOTAInstallingPanel extends Component {
    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { fontWeight: 'bold' },
                    ]}>
                    Version {this.props.firmwareVersion} files downloaded
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
                    Installing on RepOne #{this.props.connectedDevice}
                </Text>
                {/* <Text style={[SETTINGS_PANEL_STYLES.footerCancelText, {fontWeight: 'bold', paddingTop: 25, paddingBottom: 10}]} onPress={this.props.cancelInstall.bind(this)}>
                    Cancel
                </Text> */}
            </View>
        );
    }
}

export default SettingsOTAInstallingPanel;
