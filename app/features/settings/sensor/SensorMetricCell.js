import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SensorMetricCell extends Component {
    render() {
        return (
            <View style={styles.cell}>
                <Text
                    style={[SETTINGS_PANEL_STYLES.tappableText, styles.metric]}>
                    Avg Velocity
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        borderColor: '#DADADA',
        borderWidth: 1,
        borderStyle: 'solid',
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 12,
        paddingRight: 12,
    },
    metric: {
        textAlign: 'left',
    },
});

export default SensorMetricCell;
