import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

import SettingsEditKratosRollupsScreen from './rollup/SettingsEditKratosRollupsScreen';
import SettingsEditKratosMetricsScreen from './metric/SettingsEditKratosMetricsScreen';
import SetginsEditKratosPhasesScreen from './phase/SettingsEditKratosPhasesScreen';

const TABLE_HEADERS = ['REP METRIC', 'ROLLUP', 'PHASE'];

class SettingsKratosMetricsPanel extends Component {
    constructor(props) {
        super(props);
    }

    handleMetricPress = row => {
        this.props.tapMetric(row);
    };

    handleRollupPress = row => {
        this.props.tapRollup(row);
    };

    handlePhasePress = row => {
        this.props.tapPhase(row);
    };

    renderTableHeaders = () => {
        return (
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
        );
    };

    renderMetricsIOS = () => {
        return (
            <View>
                {this.props.metricRollupPhaseTable.map(
                    ([metric, rollup, phase], index) => (
                        <DataTable.Row
                            key={`row-${index}`}
                            style={[styles.row]}>
                            <DataTable.Cell
                                onPress={() =>
                                    this.handleMetricPress(index + 1)
                                }
                                style={[styles.cell]}>
                                <Text
                                    style={[
                                        SETTINGS_PANEL_STYLES.tappableText,
                                    ]}>
                                    {CollapsedMetricsUtility.metricAbbreviation(
                                        metric,
                                    )}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                                style={[styles.cell]}
                                onPress={() =>
                                    this.handleRollupPress(index + 1)
                                }>
                                <Text
                                    style={[
                                        SETTINGS_PANEL_STYLES.tappableText,
                                    ]}>
                                    {CollapsedMetricsUtility.quantifierString(
                                        rollup,
                                    )}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                                style={[styles.cell, styles.lastCell]}
                                onPress={() =>
                                    this.handlePhasePress(index + 1)
                                }>
                                <Text
                                    style={[
                                        SETTINGS_PANEL_STYLES.tappableText,
                                    ]}>
                                    {CollapsedMetricsUtility.phaseString(phase)}
                                </Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ),
                )}
            </View>
        );
    };

    renderMetricsAndroid = () => {
        return (
            <View style={{ width: 400 }}>
                {this.props.metricRollupPhaseTable.map(
                    ([metric, rollup, phase], index) => (
                        <View key={index} style={styles.rowAndroid}>
                            <View
                                style={[
                                    styles.cellAndroid,
                                    {
                                        marginRight: -1,
                                    },
                                ]}>
                                <SettingsEditKratosMetricsScreen
                                    color={'rgba(47, 128, 237, 1)'}
                                    rank={index + 1}
                                />
                            </View>
                            <View style={styles.cellAndroid}>
                                <SettingsEditKratosRollupsScreen
                                    color={'rgba(47, 128, 237, 1)'}
                                    rank={index + 1}
                                />
                            </View>
                            <View style={[styles.cellAndroid, styles.lastCell]}>
                                <SetginsEditKratosPhasesScreen
                                    color={'rgba(47, 128, 237, 1)'}
                                    rank={index + 1}
                                />
                            </View>
                        </View>
                    ),
                )}
            </View>
        );
    };

    render() {
        return (
            <View>
                <Text style={styles.labelText}>
                    {this.props.sensorName} set metrics
                </Text>

                <ScrollView horizontal={true}>
                    <View>
                        <View style={{ width: 400 }}>
                            <DataTable style={{ marginTop: 13 }}>
                                {this.renderTableHeaders()}
                                {Platform.OS === 'ios' &&
                                    this.renderMetricsIOS()}
                            </DataTable>
                        </View>
                        {Platform.OS === 'ios' ? (
                            <View>
                                <SettingsEditKratosMetricsScreen />
                                <SettingsEditKratosRollupsScreen />
                                <SetginsEditKratosPhasesScreen />
                            </View>
                        ) : (
                            this.renderMetricsAndroid()
                        )}
                    </View>
                </ScrollView>
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
        marginRight: -1,
    },
    lastCell: {
        marginRight: 0,
    },
    cellAndroid: {
        flex: 0.5,
        borderColor: '#DADADA',
        borderWidth: 1,
        marginBottom: -1,
        marginRight: -1,
    },
    row: {
        paddingHorizontal: 0,
        marginTop: 6,
        flex: 1,
    },
    rowAndroid: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    bigMetricNumber: {
        textAlign: 'center',
        fontSize: 15,
        color: '#f0565a',
    },
});

export default SettingsKratosMetricsPanel;
