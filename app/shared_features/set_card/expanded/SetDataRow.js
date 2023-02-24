import React, { PureComponent } from 'react';
import { View, StyleSheet, Text } from 'react-native';

class SetDataRow extends PureComponent {
    render() {
        const removedData = this.props.selected
            ? styles.selectedRemovedData
            : styles.removedData;

        const dataStyle = this.props.item.removed ? removedData : styles.data;

        if (is2dArray(this.props.item.columns)) {
            return (
                <View
                    style={[
                        styles.border,
                        {
                            paddingTop: 10,
                        },
                    ]}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            {this.props.item.columns.map((data, index) => {
                                const rowType = data[data.length - 1];

                                const displayData = data.slice(0, -1);

                                return (
                                    <View
                                        key={`row-${this.props.item.repDisplay}-${rowType}`}
                                        style={styles.rowWrapper}>
                                        {displayData.map((item, itemIndex) => {
                                            return (
                                                <View
                                                    key={`row-item-${itemIndex}`}
                                                    style={
                                                        styles.itemContainer
                                                    }>
                                                    <Text style={dataStyle}>
                                                        {item}
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
                        <View style={styles.bottomBorder} />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.border}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.bar}>
                            {this.props.item.columns.map((item, index) => {
                                return (
                                    <View
                                        style={styles.itemContainer}
                                        key={`data-column-${index}`}>
                                        <Text style={dataStyle}>{item}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={styles.bottomBorderWrapper}>
                        <View style={styles.bottomBorder} />
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    border: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: 'white',
    },
    row: { flex: 1, flexDirection: 'row' },
    column: { flex: 1, flexDirection: 'column' },
    bar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        left: 0,
        right: 0,
        bottom: 0,
        height: 20,
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
        color: '#BDBDBD',
    },
    selectedRemovedData: {
        textAlign: 'center',
        color: 'black',
    },
    bottomBorder: {
        height: 1,
        backgroundColor: '#F2F2F2',
        justifySelf: 'center',
    },
    bottomBorderWrapper: {
        paddingLeft: 13,
        paddingRight: 33,
    },
    icon: { marginTop: -1, marginRight: 3 },
    rowWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonWrapper: { alignSelf: 'center', marginLeft: 10 },
});

// HELPERS

const is2dArray = array => array.every(item => Array.isArray(item));

export default SetDataRow;
