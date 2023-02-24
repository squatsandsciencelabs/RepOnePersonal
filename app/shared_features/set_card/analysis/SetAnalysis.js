import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import * as Device from 'app/utility/Device';

class SetAnalysis extends Component {
    _renderAnalysis(value, unit, description, isBigMetric, key) {
        if (isBigMetric) {
            return (
                <View
                    style={styles.bigMetricBackground}
                    key={`analysis-${key}`}>
                    <Text style={styles.bigMetricText}>{value}</Text>
                    <Text style={styles.bigMetric}>{unit}</Text>
                    <Text style={styles.bigMetric} numberOfLines={2}>
                        {description}
                    </Text>
                </View>
            );
        } else {
            let textStyle =
                !this.props.rpe && description.includes('RPE')
                    ? [styles.text, styles.redText]
                    : styles.text;
            let metricStyle =
                !this.props.rpe && description.includes('RPE')
                    ? [styles.metric, styles.redMetric]
                    : styles.metric;

            return (
                <View style={styles.metricWrapper} key={`analysis-${key}`}>
                    <Text style={textStyle} numberOfLines={1}>
                        {value}
                    </Text>
                    <Text style={metricStyle}>{unit}</Text>
                    <Text style={metricStyle} numberOfLines={2}>
                        {description}
                    </Text>
                </View>
            );
        }
    }

    _renderAnalysisItems() {
        const analysis = [];

        for (let i = 1; i <= 4; i++) {
            const value = this.props[`value${i}`];
            const unit = this.props[`unit${i}`];
            const description = this.props[`description${i}`];

            const isBigMetric = i === 1;

            analysis.push(
                this._renderAnalysis(value, unit, description, isBigMetric, i),
            );
        }

        return analysis;
    }

    render() {
        let lastColumn = null;
        if (!Device.isSmallDevice()) {
            lastColumn = [
                this._renderAnalysis(
                    this.props.value5,
                    this.props.unit5,
                    this.props.description5,
                    false,
                    5,
                ),
            ];
        }

        return (
            <View
                style={[
                    styles.border,
                    styles.container,
                    { flex: 1, flexDirection: 'row' },
                ]}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        justifyContent: 'space-between',
                        paddingBottom: 10,
                    }}>
                    {this._renderAnalysisItems()}
                    {lastColumn}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingTop: 5,
        paddingBottom: 0,
        paddingLeft: 7,
    },
    border: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    redText: {
        color: 'red',
    },
    text: {
        color: '#4d4d4d',
        fontSize: 18,
        fontWeight: '500',
        marginTop: 5,
        textAlign: 'center',
    },
    metric: {
        color: '#4d4d4d',
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: 'RobotoCondensed-Regular',
    },
    redMetric: {
        color: 'red',
    },
    bigMetricBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#fddddd',
        width: 84,
        height: 84,
        borderRadius: 84 / 2,
        borderColor: '#fddddd',
        overflow: 'hidden',
        marginRight: 3,
    },
    bigMetricText: {
        textAlign: 'center',
        color: '#f0565a',
        fontSize: 18,
        fontWeight: '800',
    },
    bigMetric: {
        textAlign: 'center',
        color: '#f0565a',
        fontSize: 10,
        fontWeight: '500',
        paddingHorizontal: 16,
        alignSelf: 'center',
        fontFamily: 'RobotoCondensed-Regular',
    },
    metricWrapper: {
        flex: 1,
        paddingTop: 14,
        alignItems: 'center',
        width: 62,
        marginLeft: 7,
    },
});

export default SetAnalysis;
