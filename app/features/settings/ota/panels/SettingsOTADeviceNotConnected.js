import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class SettingsOTADeviceNotConnected extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.details}>
                    Connect a RepOne unit to check if you have the latest
                    firmware
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        fontSize: 18,
        textAlign: 'center',
    },
    details: {
        fontSize: 14,
        marginTop: 25,
        color: 'rgba(79,79,79,1)',
    },
});

export default SettingsOTADeviceNotConnected;
