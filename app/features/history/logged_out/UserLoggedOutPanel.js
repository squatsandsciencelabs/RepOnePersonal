import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class UserLoggedOutPanel extends Component {
    render() {
        let subtitle = this.props.subtitle;
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}>
                <View style={{ paddingBottom: 40 }}>
                    <Image
                        source={require('app/appearance/images/R1-Logo-DarkGray.png')}
                    />
                </View>
                <View>
                    <Text style={SETTINGS_PANEL_STYLES.headerText}>
                        {Localized('LOGGED_OUT_PANEL.TITLE')}
                    </Text>
                </View>
                <View style={{ paddingTop: 20, paddingBottom: 50 }}>
                    <Text style={SETTINGS_PANEL_STYLES.subtitleText}>
                        {Localized('LOGGED_OUT_PANEL.TEXT')}
                    </Text>
                </View>
            </View>
        );
    }
}

export default UserLoggedOutPanel;
