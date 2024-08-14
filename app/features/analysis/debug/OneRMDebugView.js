import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class OneRMDebugView extends Component {
    render() {
        if (this.props.visible) {
            return (
                <TouchableOpacity
                    style={[SETTINGS_PANEL_STYLES.blueButton]}
                    onPress={this.props.onPressButton}>
                    <Text style={[SETTINGS_PANEL_STYLES.buttonText]}>
                        {Localized('ENABLE_DEBUG_DATA')}
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    }
}

export default OneRMDebugView;
