import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default props => {
    return (
        <View>
            <View style={[styles.border, styles.container]}>
                <View style={styles.labelsWrapper}>
                    <View style={styles.headerLabel}>
                        <Text style={styles.text}>REP</Text>
                    </View>
                    {props.item.labels.map((l, index) => (
                        <View
                            style={styles.headerLabel}
                            key={`data-label-column-${index}`}>
                            <Text style={styles.text}>{l}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.unitsWrapper}>
                    <View style={styles.headerLabel}>
                        <Text style={styles.text}>#</Text>
                    </View>
                    {props.item.units.map((u, index) => (
                        <View
                            style={styles.headerLabel}
                            key={`data-label-column-${index}`}>
                            <Text style={styles.text}>{u}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.horizontalBorder} />
        </View>
    );
};

const styles = StyleSheet.create({
    headerLabel: {
        flex: 1,
        width: 45,
        height: 20,
        alignItems: 'center',
        overflow: 'hidden',
    },
    text: {
        color: 'lightgray',
    },
    container: {
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: 5,
        paddingRight: 24,
        paddingLeft: 0,
    },
    border: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingTop: 10,
    },
    horizontalBorder: {
        backgroundColor: '#e0e0e0',
        opacity: 0.5,
        height: 1,
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
