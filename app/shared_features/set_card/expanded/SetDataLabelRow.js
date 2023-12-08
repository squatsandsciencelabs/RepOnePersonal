import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('screen').width;

export default props => {
    return (
        <View>
            <View style={[styles.border, styles.container]}>
                <View style={styles.labelsWrapper}>
                    {props.item.labels.map((l, index) => (
                        <View
                            style={styles.headerLabel}
                            key={`data-label-column-${index}`}>
                            <Text style={[styles.text]}>{l}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.unitsWrapper}>
                    {props.item.units.map((u, index) => (
                        <View
                            style={styles.headerLabel}
                            key={`data-label-column-${index}`}>
                            <Text style={[styles.text, styles.unit]}>{u}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerLabel: {
        flex: 1,
        width: 64,
        height: 14,
        alignItems: 'center',
        overflow: 'hidden',
    },
    text: {
        color: 'lightgray',
        fontSize: 12,
        lineHeight: 14,
        fontWeight: '500',
        fontFamily: 'RobotoCondensed-Regular',
    },
    unit: {
        fontSize: 11,
        lineHeight: 13,
    },
    container: {
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: 10,
        paddingLeft: 0,
        paddingBottom: 15,
        height: 52,
        minWidth: SCREEN_WIDTH - 80,
    },
    border: {
        paddingTop: 10,
    },

    unitsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    labelsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
