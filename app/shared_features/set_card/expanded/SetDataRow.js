import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class SetDataRow extends PureComponent {
    render() {
        const dataStyle = this.props.item.removed
            ? styles.removedData
            : styles.data;

        if (is2dArray(this.props.item.columns)) {
            return (
                <View
                    style={[
                        styles.border,
                        {
                            paddingTop: 10,
                        },
                    ]}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {this.props.item.columns.map((data, index) => {
                                const rowType =
                                    data[data.length - 1][0].toUpperCase();

                                // showing number only for the first of the double height row
                                const itemNumber =
                                    index === 0
                                        ? this.props.item.repDisplay
                                        : '';
                                const displayData = data.slice(0, -1);

                                return (
                                    <View
                                        key={`row-${itemNumber}-${rowType}`}
                                        style={styles.rowWrapper}>
                                        {displayData.map((item, itemIndex) => {
                                            // NOTE: If this is a pure decimal, remove the starting 0 so it's just .25 instead of 0.25
                                            const displayItem =
                                                item < 1
                                                    ? item.toString().slice(1)
                                                    : item;
                                            return (
                                                <View
                                                    key={`row-item-${itemIndex}`}
                                                    style={
                                                        styles.itemContainer
                                                    }>
                                                    <Text style={dataStyle}>
                                                        {displayItem}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.bottomBorderWrapper}>
                        {!this.props.item.isLast && (
                            <View style={styles.bottomBorder} />
                        )}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.border}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.bar}>
                            <View style={styles.itemContainer}>
                                <Text style={dataStyle}>
                                    {this.props.item.repDisplay}
                                </Text>
                            </View>
                            {this.props.item.columns.map((i, index) => (
                                <View
                                    style={styles.itemContainer}
                                    key={`data-column-${index}`}>
                                    <Text style={dataStyle}> {i} </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    border: {
        borderColor: '#e0e0e0',
        borderRightWidth: 1,
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white',
    },
    bar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        left: 0,
        right: 0,
        bottom: 0,
        height: 40,
        padding: 0,
        marginRight: 0,
    },
    itemContainer: {
        width: 64,
        height: 20,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    data: {
        textAlign: 'center',
        color: 'rgba(77, 77, 77, 1)',
    },
    removedData: {
        textAlign: 'center',
        color: 'lightgray',
    },
    bottomBorder: {
        height: 1,
        backgroundColor: '#F2F2F2',
        justifySelf: 'center',
    },
    bottomBorderWrapper: {
        paddingLeft: 13,
        paddingRight: 33,
        marginTop: 10,
    },
    icon: { marginTop: -1, marginRight: 3 },
    rowWrapper: {
        flexDirection: 'row',
    },
    buttonWrapper: { alignSelf: 'center', marginLeft: 10 },
});

// HELPERS

const is2dArray = array => array.every(item => Array.isArray(item));

export default SetDataRow;
