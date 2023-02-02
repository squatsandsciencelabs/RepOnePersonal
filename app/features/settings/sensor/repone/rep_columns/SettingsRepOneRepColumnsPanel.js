import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import SettingsEditRepOneRepColumnsScreen from './edit/SettingsEditRepOneRepColumnsScreen';

class SettingsRepOneRepColumnsPanel extends Component {
    handleColumnPress = row => {
        this.props.presentEdit(row);
    };

    renderRow = (metric, index) => {
        if (Platform.OS === 'ios') {
            return (
                <View style={styles.nameWrapper}>
                    <Text style={[SETTINGS_PANEL_STYLES.tappableText]}>
                        {metric}
                    </Text>
                    <Image
                        source={require('app/appearance/images/icon_rep_columns_arrow.png')}
                    />
                </View>
            );
        }
        return (
            <View style={[{ flex: 1 }, styles.dropdownButton]}>
                <SettingsEditRepOneRepColumnsScreen
                    color={'rgba(47, 128, 237, 1)'}
                    rank={index + 1}
                    dropdownIconColor={'#4D4D4D'}
                />
            </View>
        );
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
                                key={`rep-column-${index + 1}`}
                                onPress={() =>
                                    this.handleColumnPress(index + 1)
                                }>
                                <View
                                    style={
                                        Platform.OS === 'ios'
                                            ? styles.row
                                            : styles.rowAndroid
                                    }>
                                    <Text style={styles.numeric}>
                                        {index + 1}.
                                    </Text>
                                    <View
                                        style={{
                                            lex: 1,
                                            flexDirection: 'row',
                                        }}>
                                        {this.renderRow(metric, index)}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {Platform.OS === 'ios' && (
                    <SettingsEditRepOneRepColumnsScreen />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    columnsWrapper: {
        marginTop: 7,
        paddingRight: 20,
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
        width: 15,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 9,
        alignItems: 'center',
    },
    rowAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 12,
        marginRight: 27,
        alignItems: 'center',
    },
    dropdownButton: {
        backgroundColor: 'white',
    },
});

export default SettingsRepOneRepColumnsPanel;
