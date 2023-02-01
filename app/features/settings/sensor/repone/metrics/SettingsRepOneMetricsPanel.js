import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

const TABLE_HEADERS = ['REP METRIC', 'ROLLUP'];

class SettingsRepOneSensorSetMetrics extends Component {
    constructor(props) {
        super(props);
        this.dataToRender = [
            [this.props.metric1, this.props.quantifier1],
            [this.props.metric2, this.props.quantifier2],
            [this.props.metric3, this.props.quantifier3],
            [this.props.metric4, this.props.quantifier4],
            [this.props.metric5, this.props.quantifier5],
        ];
    }

    render() {
        return (
            <View>
                <Text style={styles.labelText}>
                    {this.props.sensorName} set metrics
                </Text>
                <DataTable style={{ marginTop: 13 }}>
                    <DataTable.Header style={styles.header}>
                        {TABLE_HEADERS.map((metric, index) => {
                            return (
                                <DataTable.Title
                                    key={`metric-${index}`}
                                    style={{
                                        paddingVertical: 0,
                                    }}>
                                    <Text style={styles.metric}>{metric}</Text>
                                </DataTable.Title>
                            );
                        })}
                    </DataTable.Header>
                    {this.dataToRender.map(([metric, quantifier], index) => {
                        return (
                            <DataTable.Row
                                key={`row-${index}`}
                                style={styles.row}>
                                <DataTable.Cell
                                    style={[styles.cell, { marginRight: -1 }]}>
                                    <Text
                                        style={[
                                            SETTINGS_PANEL_STYLES.tappableText,
                                        ]}>
                                        {CollapsedMetricsUtility.metricAbbreviation(
                                            metric,
                                        )}
                                    </Text>
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>
                                    <Text
                                        style={[
                                            SETTINGS_PANEL_STYLES.tappableText,
                                        ]}>
                                        {CollapsedMetricsUtility.quantifierString(
                                            quantifier,
                                        )}
                                    </Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 0,
        borderBottomWidth: 0,
        flex: 1,
        height: 15,
        paddingBottom: 3,
    },
    metric: {
        lineHeight: 15,
        fontSize: 10,
    },
    labelText: {
        fontSize: 16,
        color: 'rgba(77, 77, 77, 1)',
        marginTop: 35,
    },
    section: {
        marginTop: 35,
    },
    cell: {
        paddingHorizontal: 12,
        paddingVertical: 13,
        borderColor: '#DADADA',
        borderWidth: 1,
        borderRightWidth: 1,
    },

    row: {
        paddingHorizontal: 0,
        marginTop: 10,
    },
});

export default SettingsRepOneSensorSetMetrics;
