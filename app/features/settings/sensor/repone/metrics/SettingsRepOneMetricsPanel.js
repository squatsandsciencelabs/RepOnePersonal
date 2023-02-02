import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { DataTable } from 'react-native-paper';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

import SettingsEditQuantifiersScreen from './quantifier/SettingsEditQuantifiersScreen';
import SettingsEditMetricsScreen from './metric/SettingsEditMetricsScreen';

const TABLE_HEADERS = ['REP METRIC', 'ROLLUP'];

class SettingsRepOneSensorSetMetrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataToRender: [
                [this.props.metric1, this.props.quantifier1],
                [this.props.metric2, this.props.quantifier2],
                [this.props.metric3, this.props.quantifier3],
                [this.props.metric4, this.props.quantifier4],
                [this.props.metric5, this.props.quantifier5],
            ],
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.setState({
                dataToRender: [
                    [this.props.metric1, this.props.quantifier1],
                    [this.props.metric2, this.props.quantifier2],
                    [this.props.metric3, this.props.quantifier3],
                    [this.props.metric4, this.props.quantifier4],
                    [this.props.metric5, this.props.quantifier5],
                ],
            });
        }
    }

    handleMetricPress = row => {
        this.props.tapMetric(row);
    };

    handleQuantifierPress = row => {
        this.props.tapQuantifier(row);
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
                {this.state.dataToRender.map(([metric, quantifier], index) => (
                    <DataTable.Row key={`row-${index}`} style={styles.row}>
                        <DataTable.Cell
                            onPress={() => this.handleMetricPress(index + 1)}
                            style={[styles.cell, { marginRight: -1 }]}>
                            <Text style={[SETTINGS_PANEL_STYLES.tappableText]}>
                                {CollapsedMetricsUtility.metricAbbreviation(
                                    metric,
                                )}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell
                            style={styles.cell}
                            onPress={() =>
                                this.handleQuantifierPress(index + 1)
                            }>
                            <Text style={[SETTINGS_PANEL_STYLES.tappableText]}>
                                {CollapsedMetricsUtility.quantifierString(
                                    quantifier,
                                )}
                            </Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </View>
        );
    };

    renderMetricsAndroid = () => {
        return (
            <View>
                {this.state.dataToRender.map(([metric, quantifier], index) => (
                    <View key={index} style={styles.rowAndroid}>
                        <View
                            style={[
                                styles.cellAndroid,
                                {
                                    marginRight: -1,
                                },
                            ]}>
                            <SettingsEditMetricsScreen
                                color={'rgba(47, 128, 237, 1)'}
                                rank={index + 1}
                            />
                        </View>
                        <View style={styles.cellAndroid}>
                            <SettingsEditQuantifiersScreen
                                color={'rgba(47, 128, 237, 1)'}
                                rank={index + 1}
                            />
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    render() {
        return (
            <View>
                <Text style={styles.labelText}>
                    {this.props.sensorName} set metrics
                </Text>

                <DataTable style={{ marginTop: 13 }}>
                    {this.renderTableHeaders()}
                    {Platform.OS === 'ios' && this.renderMetricsIOS()}
                </DataTable>

                {Platform.OS === 'ios' ? (
                    <View>
                        <SettingsEditMetricsScreen />
                        <SettingsEditQuantifiersScreen />
                    </View>
                ) : (
                    this.renderMetricsAndroid()
                )}
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
    cellAndroid: {
        flex: 0.5,
        borderColor: '#DADADA',
        borderWidth: 1,
        marginBottom: -1,
    },
    row: {
        paddingHorizontal: 0,
        marginTop: 6,
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

export default SettingsRepOneSensorSetMetrics;
