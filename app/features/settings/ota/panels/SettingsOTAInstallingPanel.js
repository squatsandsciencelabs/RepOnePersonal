import React, { Component } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAInstallingPanel extends Component {
    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { fontWeight: '500', marginTop: 10 },
                    ]}>
                    Version {this.props.firmwareVersion} installing update...
                </Text>
                <Progress.Circle
                    style={{ marginTop: 10, marginBottom: 10 }}
                    size={50}
                    progress={this.props.progress}
                    showsText={true}
                    formatText={() => `${this.props.progress * 100}%`}
                    borderWidth={0}
                    unfilledColor={'#D4D4D4'}
                />
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { paddingBottom: 42 },
                    ]}>
                    Installing on RepOne{' '}
                    {this.props.connectedDevice &&
                        `#${this.props.connectedDevice}`}
                </Text>
            </View>
        );
    }
}

export default SettingsOTAInstallingPanel;
