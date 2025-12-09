import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class SettingsFeedbackPanel extends Component {
    render() {
        return (
            <View
                style={[
                    SETTINGS_PANEL_STYLES.panel,
                    {
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    },
                ]}>
                <Text style={SETTINGS_PANEL_STYLES.headerText}>
                    {Localized('FEEDBACK_TITLE')} {'\n'}
                </Text>
                <TouchableOpacity onPress={() => this.props.tappedFeedback()}>
                    <Text
                        style={[
                            SETTINGS_PANEL_STYLES.tappableText,
                            { fontSize: 14 },
                        ]}>
                        help@getrepone.com
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default SettingsFeedbackPanel;
