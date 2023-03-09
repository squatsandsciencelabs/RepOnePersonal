import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import CalibrationModalScreen from './modal/CalibrationModalScreen';

export default function (props) {
    if (!props.isVisible) {
        return null;
    }

    return (
        <View>
            <View
                style={[
                    SETTINGS_PANEL_STYLES.panel,
                    { padding: 20, flexDirection: 'column' },
                ]}>
                <Text style={styles.titleText}>3D Calibration</Text>
                <Text style={styles.text}>
                    Caution: these functions can impair RepOne’s accuracy, do
                    not use unless directed by support.
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => props.tappedCalibrate()}>
                        <Text style={styles.option}>CALIBRATE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.tappedReset()}>
                        <Text style={styles.option}>RESET</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <CalibrationModalScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    titleText: {
        color: 'rgba(130, 130, 130, 1)',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        color: 'rgba(130, 130, 130, 1)',
        fontSize: 13,
    },
    option: {
        color: 'rgba(130, 130, 130, 1)',
        fontSize: 13,
        fontWeight: 'bold',
        paddingRight: 20,
    },
});
