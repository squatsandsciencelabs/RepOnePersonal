import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import SettingsEditRepOneRepColumnsScreen from './edit/SettingsEditRepOneRepColumnsScreen';

class SettingsRepOneRepColumnsPanel extends Component {
    handleColumnPress = row => {
        this.props.presentEdit(row);
    };

    render() {
        return (
            <View style={styles.section}>
                <Text style={styles.labelText}>
                    {this.props.sensorName} rep columns
                </Text>
                <View style={styles.columnsWrapper}>
                    {this.props.metrics.map((metric, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() =>
                                    this.handleColumnPress(index + 1)
                                }>
                                <View
                                    key={`rep-column-${index + 1}`}
                                    style={styles.row}>
                                    <Text style={styles.numeric}>
                                        {index + 1}.
                                    </Text>
                                    <View style={styles.nameWrapper}>
                                        <Text
                                            style={[
                                                SETTINGS_PANEL_STYLES.tappableText,
                                            ]}>
                                            {metric}
                                        </Text>
                                        <Image
                                            source={require('app/appearance/images/icon_rep_columns_arrow.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <SettingsEditRepOneRepColumnsScreen />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    columnsWrapper: {
        marginTop: 7,
        paddingRight: 27,
    },
    labelText: {
        fontSize: 16,
        color: 'rgba(77, 77, 77, 1)',
    },
    section: {
        marginTop: 35,
    },
    numeric: {
        color: '#979797',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 9,
        alignItems: 'center',
    },
    nameWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 12,
    },
});

export default SettingsRepOneRepColumnsPanel;
