import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import SetDataLabelRow from './SetDataLabelRow';
import SetDataRow from './SetDataRow';

const SUBHEADER_HEIGHT = 52;
const ROW_HEIGHT = 65;

class SetData extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.item.data.length !== nextProps.item.data.length) {
            this.props.onRowDeselect();
        }
    }

    removeRep = (setID, rep) => {
        this.props.onRowDeselect();
        this.props.onPressRemove(setID, rep);
    };

    restoreRep = (setID, rep) => {
        this.props.onRowDeselect();
        this.props.onPressRestore(setID, rep);
    };

    handleSetDataRowSelect = item => {
        const overlayNumbers = is2dArray(item.columns)
            ? item.columns.map(column => {
                  const rowType = column[column.length - 1][0].toUpperCase();
                  return `${item.repDisplay}${rowType}`;
              })
            : [item.repDisplay];

        this.props.onRowSelect(
            item.setID,
            item.rep,
            item.repDisplay,
            overlayNumbers,
            item.removed,
        );
    };

    handleSetDataRowDeselect = () => {
        this.props.onRowDeselect();
    };

    renderRowOverlay() {
        if (this.props.item.setID === this.props.selectedRowSetID) {
            return (
                <TouchableOpacity
                    onPress={this.handleSetDataRowDeselect}
                    style={[
                        styles.overlay,
                        {
                            marginTop: this.props.selectedRowDisplayRep
                                ? getOverlayMargin(
                                      this.props.item.data.length,
                                      this.props.selectedRowDisplayRep,
                                      this.props.item.repsAreChronological,
                                  )
                                : 0,
                        },
                    ]}>
                    <View style={styles.overlayContentWrapper}>
                        <View style={styles.overlayNumbersContainer}>
                            {this.renderRowOverlayNumbers()}
                        </View>
                        <View style={styles.leftShadow} />
                        {this.renderRowOverlayButton()}
                    </View>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderRowOverlayNumbers() {
        if (!this.props.selectedRowOverlayNumbers) {
            return null;
        }

        return (
            <View>
                {this.props.selectedRowOverlayNumbers.map((column, index) => {
                    return (
                        <View
                            key={`overlay-numbers-${this.props.selectedRowDisplayRep}-${index}`}>
                            <Text style={styles.selectedData}>{column}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }

    renderRowOverlayButton() {
        const pressHandler =
            this.props.selectedRowSetID !== null
                ? this.props.selectedRowIsRemoved
                    ? this.restoreRep
                    : this.removeRep
                : undefined;

        const buttonStyle = this.props.selectedRowIsRemoved
            ? styles.restoreRepButton
            : styles.removeRepButton;

        const content = this.props.selectedRowIsRemoved ? (
            <Text style={styles.restoreRepButtonText}>RESTORE REP</Text>
        ) : (
            <Image
                source={require('app/appearance/images/cancel_set_row_selection.png')}
            />
        );

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                    pressHandler(
                        this.props.item.setID,
                        this.props.selectedRowRep,
                    )
                }
                style={buttonStyle}>
                {content}
            </TouchableOpacity>
        );
    }

    renderRowNumbers() {
        return (
            <View style={styles.rowNumbersWrapper}>
                {this.props.item.data.map(data => {
                    return (
                        <View
                            style={styles.rowNumberWrapper}
                            key={`rep-${data.rep}`}>
                            <Text
                                style={[
                                    styles.rowNumber,
                                    {
                                        color: data.removed
                                            ? '#EBEBEB'
                                            : '#BDBDBD',
                                    },
                                ]}>
                                {data.repDisplay}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderRowOverlay()}
                {this.renderRowNumbers()}

                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.scrollableContent}>
                        <SetDataLabelRow item={this.props.item.subheader} />

                        <View>
                            {this.props.item.data.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={`data-row-${index}`}
                                        activeOpacity={1}
                                        onPress={() =>
                                            this.handleSetDataRowSelect(item)
                                        }
                                        style={styles.setDataRowWrapper}>
                                        <SetDataRow
                                            key={index}
                                            item={item}
                                            selected={
                                                this.props.selectedRowRep ===
                                                    item.rep &&
                                                this.props.selectedRowSetID ===
                                                    item.setID
                                            }
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    data: {
        textAlign: 'left',
        color: 'rgba(77, 77, 77, 1)',
    },
    selectedData: {
        color: '#EB5757',
    },
    removeRepButton: {
        backgroundColor: '#FDEEEE',
        width: 57,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
    },
    restoreRepButton: {
        backgroundColor: '#FDEEEE',
        width: 57,
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
    },
    restoreRepButtonText: {
        color: '#EB5757',
        fontWeight: '500',
        fontSize: 10,
        lineHeight: 12,
        width: 57,
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        width: '100%',
        height: ROW_HEIGHT,
        zIndex: 2,
    },
    overlayNumbersContainer: {
        backgroundColor: '#FDEEEE',
        width: 46,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayContentWrapper: {
        zIndex: 2,
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowNumbersWrapper: {
        position: 'absolute',
        left: 0,
        zIndex: 1,
        paddingTop: 50,
        width: 46,
        backgroundColor: 'white',
        shadowColor: '#fff',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.92,
        shadowRadius: 7,
    },
    leftShadow: {
        height: 55,
        width: 57,
        zIndex: 0,
        backgroundColor: '#FDEEEE',

        shadowColor: '#FDEEEE',
        shadowOffset: {
            width: -3,
            height: 0,
        },
        shadowOpacity: 0.92,
        shadowRadius: 7,
    },
    rowNumberWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: ROW_HEIGHT,
    },
    rowNumber: {
        zIndex: 1,
        fontWeight: '300',
        fontSize: 24,
    },
    scrollableContent: {
        flex: 1,
        paddingLeft: 36,
        backgroundColor: 'white',
        minWidth: '100%',
    },
    setDataRowWrapper: {
        height: ROW_HEIGHT,
    },
});

const is2dArray = array => array.every(item => Array.isArray(item));

const getOverlayMargin = (items, displayRep, isChronological) =>
    isChronological
        ? (displayRep - 1) * ROW_HEIGHT + SUBHEADER_HEIGHT
        : (items - displayRep) * ROW_HEIGHT + SUBHEADER_HEIGHT;

export default SetData;
