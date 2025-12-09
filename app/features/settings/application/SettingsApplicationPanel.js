import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import * as DateUtils from 'app/utility/DateUtils';
import SettingsEndSetTimerScreen from './timer/SettingsEndSetTimerScreen';
import SettingsMetric from './metric/SettingsMetric';
import Localized from 'app/services/Localization';

class SettingsApplicationPanel extends Component {
    // ACTIONS

    _tappedSetTimer() {
        this.props.tapEndSetTimer();
    }

    _tapDefaultMetric() {
        this.props.tapDefaultMetric();
    }

    // RENDER

    render() {
        if (Platform.OS === 'ios') {
            return (
                <View
                    style={[
                        SETTINGS_PANEL_STYLES.panel,
                        { flexDirection: 'column' },
                    ]}>
                    <Text style={[{ marginBottom: 20 }, styles.titleText]}>
                        {Localized('GENERAL_APP_SETTINGS')}
                    </Text>

                    <View>
                        <TouchableOpacity
                            onPress={() => this._tappedSetTimer()}>
                            <Text
                                style={[{ marginBottom: 2 }, styles.labelText]}>
                                {Localized('TIME_TO_START_NEW_SET')}
                            </Text>
                            <Text style={styles.linkText}>
                                {DateUtils.timerDurationDescription(
                                    this.props.endSetTimerDuration,
                                )}
                                {'\n'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <SettingsEndSetTimerScreen />

                    <View style={{ marginBottom: 15 }}>
                        <TouchableOpacity
                            onPress={() => this._tapDefaultMetric()}>
                            <Text
                                style={[{ marginBottom: 2 }, styles.labelText]}>
                                {Localized('DEFAULT_UNITS')}
                            </Text>
                            <Text style={styles.linkText}>
                                {Localized(
                                    `DISPLAY_METRIC.${this.props.defaultMetric}`,
                                )}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <SettingsMetric />
                </View>
            );
        } else {
            return (
                <View
                    style={[
                        SETTINGS_PANEL_STYLES.panel,
                        { flexDirection: 'column' },
                    ]}>
                    <Text style={[{ marginBottom: 20 }, styles.titleText]}>
                        {Localized('SETTINGS')}
                    </Text>

                    <View>
                        <Text
                            style={[
                                { marginLeft: 7, marginBottom: -10 },
                                styles.labelText,
                            ]}>
                            {Localized('TIME_TO_START_NEW_SET')}
                        </Text>
                    </View>
                    <SettingsEndSetTimerScreen />

                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={[
                                { marginLeft: 7, marginBottom: -10 },
                                styles.labelText,
                            ]}>
                            {Localized('SET_DEFAULT_METRIC')}
                        </Text>
                    </View>
                    <SettingsMetric />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    titleText: {
        color: 'rgba(77, 77, 77, 1)',
        textAlign: 'center',
        fontSize: 20,
    },
    labelText: {
        fontSize: 16,
        color: 'rgba(77, 77, 77, 1)',
    },
    linkText: {
        fontSize: 16,
        color: 'rgba(47, 128, 237, 1)',
    },
});

export default SettingsApplicationPanel;
