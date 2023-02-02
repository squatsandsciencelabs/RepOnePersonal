import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Linking,
} from 'react-native';
import SettingsKratosAutoDeleteRepsModalScreen from 'app/features/settings/sensor/kratos/kratos_auto_delete_reps_modal/SettingsKratosAutoDeleteRepsModalScreen';

const KRATOS_REDIRECT_URL =
    'https://store.kabukistrength.net/collections/kratos-1';

class SettingsKratosAutoDeleteRepsPanel extends Component {
    _tapKratosFlywheel() {
        Linking.canOpenURL(KRATOS_REDIRECT_URL).then(supported => {
            if (supported) {
                Linking.openURL(KRATOS_REDIRECT_URL);
            }
        });
    }

    _tapKratosAutoDeleteReps() {
        this.props.tapKratosAutoDeleteReps();
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <View>
                    <View>
                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                            <TouchableOpacity
                                onPress={() => this._tapKratosFlywheel()}>
                                <Text style={styles.linkText}>
                                    Kratos Flywheel&nbsp;
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.labelText}>
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
                    <SettingsKratosAutoDeleteRepsModalScreen />
                </View>
            );
        }
        return (
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: 7,
                        marginBottom: -10,
                    }}>
                    <TouchableOpacity onPress={this._tapKratosFlywheel}>
                        <Text style={styles.linkText}>
                            Kratos Flywheel&nbsp;
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.labelText}>
                        auto-delete initial reps
                    </Text>
                </View>
                <SettingsKratosAutoDeleteRepsModalScreen />
            </View>
        );
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

export default SettingsKratosAutoDeleteRepsPanel;
