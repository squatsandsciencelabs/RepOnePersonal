import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';

import Pill from 'app/shared_features/pill/Pill';

const kratosIconMini = require('app/appearance/images/kratos-icon-mini.png');

class SetSummary extends Component {
    render() {
        let tagsPills = [];

        if (this.props.tags) {
            this.props.tags.map((tag, index) => {
                tagsPills.push(
                    <Pill
                        key={`tag-pill-${index}`}
                        text={tag}
                        style={styles.pill}
                    />,
                );
            });
        }

        let content = (
            <View style={styles.row}>
                <View style={styles.reponeWeight}>
                    <Text style={styles.text}>
                        {this.props.weight} {this.props.metric} x{' '}
                        {this.props.numReps}
                    </Text>
                </View>

                {tagsPills}
            </View>
        );

        if (this.props.deviceType === 'Kratos') {
            let kratosDiscsPills = [];

            if (this.props.kratosDiscs) {
                Object.entries(this.props.kratosDiscs).map(
                    ([key, value], index, array) => {
                        if (value) {
                            kratosDiscsPills.push(
                                <View
                                    style={[
                                        styles.kratosPillWrapper,
                                        {
                                            paddingRight:
                                                index === array.length - 1
                                                    ? 8
                                                    : 0,
                                        },
                                    ]}
                                    key={`kratos-pill-${index}`}>
                                    <Pill
                                        text={key}
                                        noTextTransform
                                        style={styles.kratosPill}
                                    />
                                    {value > 1 && (
                                        <Text style={styles.kratosDiscValue}>
                                            {value}
                                        </Text>
                                    )}
                                </View>,
                            );
                        }
                    },
                );
            }

            content = (
                <View style={styles.row}>
                    <View style={styles.kratosIcon}>
                        <Image source={kratosIconMini} />
                    </View>

                    {kratosDiscsPills}
                    {tagsPills}
                </View>
            );
        }

        return (
            <View style={[styles.border, styles.container]}>
                <ScrollView
                    horizontal={true}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    {content}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, height: 38 },
    border: {
        borderColor: '#e0e0e0',
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'white',
    },
    text: {
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 12,
        fontWeight: 'bold',
    },
    pill: {
        marginLeft: 5,
    },
    kratosPillWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eeeee',
    },
    kratosPill: {
        paddingLeft: 10,
    },
    kratosDiscValue: {
        color: 'blue',
        paddingLeft: 3,
    },
    kratosIcon: {
        marginLeft: 17,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    reponeWeight: {
        marginLeft: 12,
        justifyContent: 'center',
    },
});

export default SetSummary;
