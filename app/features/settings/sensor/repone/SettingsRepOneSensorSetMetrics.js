import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class SettingsRepOneSensorSetMetrics extends Component {
    render() {
        return (
            <View style={styles.section}>
                <Text style={styles.labelText}>
                    {this.props.sensorName} set metrics
                </Text>
                <ScrollView
                    scrollEnabled={true}
                    horizontal={true}
                    alwaysBounceHorizontal>
                    <View
                        style={{
                            flexDirection: 'row',
                            overflow: 'scroll',
                            flex: 1,
                        }}></View>
                </ScrollView>
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

export default SettingsRepOneSensorSetMetrics;
