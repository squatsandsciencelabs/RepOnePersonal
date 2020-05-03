import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert,
    Platform,
}  from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import CalibrationModalScreen from './modal/CalibrationModalScreen';

export default function (props) {
    if (!props.isVisible) {
        return null;
    }

    return (<View>
        <View style={ [SETTINGS_PANEL_STYLES.panel, { padding: 0, flexDirection: 'column' }] }>
            <TouchableOpacity style={{padding: 20}} onPress={ () => props.tappedCalibrate() }>
                <Text style={styles.titleText}>Calibrate 3D sensing</Text>
                <Text style={styles.text}>Caution: do not use this option unless directed by RepOne support.</Text>
            </TouchableOpacity>
        </View>
        <CalibrationModalScreen />
    </View>);
}

const styles = StyleSheet.create({
    titleText: {
        color: 'rgba(130, 130, 130, 1)',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10
    },
    text: {
        color: 'rgba(130, 130, 130, 1)',
        fontSize: 13,
    },
});
