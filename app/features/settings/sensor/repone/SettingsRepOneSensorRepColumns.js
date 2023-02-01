import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

class SettingsRepOneSensorRepColumns extends Component {
    render() {
        return (
            <View style={styles.section}>
                <Text style={styles.labelText}>
                    {this.props.sensorName} rep columns
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    labelText: {
        fontSize: 16,
        color: 'rgba(77, 77, 77, 1)',
    },
    section: {
        marginTop: 35,
    },
});

export default SettingsRepOneSensorRepColumns;
