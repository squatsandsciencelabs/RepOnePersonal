import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Linking,
    Image,
} from 'react-native';
import SettingsKratosAutoDeleteRepsModalScreen from 'app/features/settings/sensor/kratos/kratos_auto_delete_reps_modal/SettingsKratosAutoDeleteRepsModalScreen';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsKratosAutoDeleteRepsPanel extends Component {
    _tapKratosAutoDeleteReps() {
        this.props.tapKratosAutoDeleteReps();
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <View style={styles.container}>
                    <View>
                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                            <Text style={styles.labelText}>
                                Auto-delete initial Kratos Flywheel reps
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => this._tapKratosAutoDeleteReps()}>
                            <View style={styles.nameWrapper}>
                                <Text
                                    style={[
                                        SETTINGS_PANEL_STYLES.tappableText,
                                    ]}>
                                    {this.props.kratosAutoDeleteReps} reps
                                </Text>
                                <Image
                                    source={require('app/appearance/images/icon_rep_columns_arrow.png')}
                                />
                            </View>
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
                    <Text style={styles.labelText}>
                        Auto-delete initial Kratos Flywheel reps
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
    nameWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 27,
        alignItems: 'center',
        marginTop: 9,
    },
    container: {
        marginTop: 40,
    },
});

export default SettingsKratosAutoDeleteRepsPanel;
