import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Linking,
} from 'react-native';

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import * as DateUtils from 'app/utility/DateUtils';
import SettingsEndSetTimerScreen from './timer/SettingsEndSetTimerScreen';
import SettingsMetric from './metric/SettingsMetric';
import SettingsKratosAutoDeleteRepsScreen from 'app/features/settings/application/kratos_auto_delete_reps/SettingsKratosAutoDeleteRepsScreen';

const KRATOS_REDIRECT_URL =
    'https://store.kabukistrength.net/collections/kratos-1';

class SettingsApplicationPanel extends Component {
    // ACTIONS

    _tappedSetTimer() {
        this.props.tapEndSetTimer();
    }

    _tapDefaultMetric() {
        this.props.tapDefaultMetric();
    }

    _tapKratosAutoDeleteReps() {
        this.props.tapKratosAutoDeleteReps();
    }

    _tapKratosFlywheel() {
        Linking.canOpenURL(KRATOS_REDIRECT_URL).then(supported => {
            if (supported) {
                Linking.openURL(KRATOS_REDIRECT_URL);
            }
        });
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
                        Settings
                    </Text>

                    <View>
                        <TouchableOpacity
                            onPress={() => this._tappedSetTimer()}>
                            <Text
                                style={[{ marginBottom: 2 }, styles.labelText]}>
                                Time to start new set
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
                                Default units
                            </Text>
                            <Text style={styles.linkText}>
                                {this.props.defaultMetric}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <SettingsMetric />

                    <View>
                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                            <TouchableOpacity
                                onPress={() => this._tapKratosFlywheel()}>
                                <Text style={styles.linkText}>
                                    Kratos Flywheel
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.labelText}>
                                {' '}
                                auto-delete initial reps
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => this._tapKratosAutoDeleteReps()}>
                            <Text style={styles.linkText}>
                                {this.props.kratosAutoDeleteReps} reps
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <SettingsKratosAutoDeleteRepsScreen />
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
                        Settings
                    </Text>

                    <View>
                        <Text
                            style={[
                                { marginLeft: 7, marginBottom: -10 },
                                styles.labelText,
                            ]}>
                            Time to start new set
                        </Text>
                    </View>
                    <SettingsEndSetTimerScreen />

                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={[
                                { marginLeft: 7, marginBottom: -10 },
                                styles.labelText,
                            ]}>
                            Set default metric
                        </Text>
                    </View>
                    <SettingsMetric />

                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 7,
                            marginBottom: -10,
                        }}>
                        <TouchableOpacity onPress={this._tapKratosFlywheel}>
                            <Text style={styles.linkText}>Kratos Flywheel</Text>
                        </TouchableOpacity>
                        <Text style={styles.labelText}>
                            {' '}
                            auto-delete initial reps
                        </Text>
                    </View>
                    <SettingsKratosAutoDeleteRepsScreen />
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
