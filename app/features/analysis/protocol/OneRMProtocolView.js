import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Slider } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class OneRMProtocoView extends Component {
    render() {
        const title = Localized('ANALYTICS_PROTOCOL_VIEW.TITLE');
        const body = Localized('ANALYTICS_PROTOCOL_VIEW.TEXT');
        return (
            <View
                style={[
                    SETTINGS_PANEL_STYLES.panel,
                    {
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 20,
                    },
                ]}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={{ marginTop: 20 }}>{body}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        color: 'rgba(77, 77, 77, 1)',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default OneRMProtocoView;
