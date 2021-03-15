import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import SettingsEditColumnsScreen from './edit/SettingsEditColumnsScreen';

class SettingsMetricsPanel extends Component {

    // ACTIONS

    _tapCurrentMetric(row) {
        this.props.presentEdit(row)
    }

    // RENDER

    _renderRow(row) {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={styles.numberBackground}>
                    <Text style={styles.numberLabel}>{row}</Text>
                </View>
                <TouchableOpacity
                    style={[SETTINGS_PANEL_STYLES.blueButton, {width: 200, height: 30, marginLeft: 10, marginBottom: 10}]}
                    onPress={() => this._tapCurrentMetric(row)}>
                    <Text style={SETTINGS_PANEL_STYLES.buttonText}>
                        {this.props.metrics[row-1]}
                    </Text>
                    <Icon name="caret-down" size={10} color='white' style={{right: 5, position:'absolute'}} />
                </TouchableOpacity>
            </View>            
        ); 
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <View style={ [SETTINGS_PANEL_STYLES.panel, { flexDirection: 'column' }] }>
                    <Text style={[{marginBottom: 20}, styles.titleText]}>Set Columns</Text>
                    <View style={{marginBottom: 15}}>
                        {this.props.metrics.map((m, i) => this._renderRow(i+1))}
                    </View>
                    <SettingsEditColumnsScreen />
                </View>
            );
        } else {
            return (
                <View style={ [SETTINGS_PANEL_STYLES.panel, { flexDirection: 'column' }] }>
                    <Text style={[{marginBottom: 20}, styles.titleText]}>Set Columns</Text>
                    <View style={{marginBottom: 15}}>
                        {this.props.metrics.map((m, i) => <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={styles.numberBackground}><Text style={styles.numberLabel}>{i+1}</Text></View>
                            <View style={[{flex: 1}, styles.dropdownButton]}><SettingsEditColumnsScreen color={'white'} rank={i+1} /></View>
                        </View>)}
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    dropdownButton: {
        backgroundColor: 'rgba(47, 128, 237, 1)',
        borderRadius: 3,
        marginLeft: 5,
        marginBottom: 5,
        height: 40,
    },
    titleText: {
        color: 'rgba(77, 77, 77, 1)',
        textAlign: 'center',
        fontSize: 20,
    },
    numberBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 25,
        height: 25,
        marginLeft: Platform.OS === 'ios' ? -5 : -10,
        marginTop: Platform.OS === 'ios' ? 2 : 13,
    },
    numberLabel: {
        textAlign: 'center',
        fontSize: 15,
    }
});

export default SettingsMetricsPanel;
