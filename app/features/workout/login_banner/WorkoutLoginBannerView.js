import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import Localized from 'app/services/Localization';

class WorkoutLoginBannerView extends Component {
    render() {
        if (this.props.isLoggingIn) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>{Localized('LOGGING_IN')}</Text>
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => this.props.tappedBanner()}>
                    <Text style={styles.text}>
                        {Localized('WORKOUT_LOGIN_BANNER_MESSAGE')}
                    </Text>
                </TouchableOpacity>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    },
    text: {
        fontSize: 12,
        color: 'white',
        textAlign: 'center',
    },
});

export default WorkoutLoginBannerView;
