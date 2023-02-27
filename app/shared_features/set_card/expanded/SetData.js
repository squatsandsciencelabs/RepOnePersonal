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

class SetData extends Component {
    constructor(props) {
        super(props);

        this.emptySelectedRow = {
            columns: null,
            removed: false,
        };

        this.state = {
            selectedRow: this.emptySelectedRow,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.item.data !== nextProps.item.data) {
            this.setState({
                selectedRow: this.emptySelectedRow,
            });
        }
    }

    removeRep = (setID, rep) => {
        this.props.onRowDeselect();

        this.props.onPressRemove(setID, rep);

        this.setState({
            selectedRow: this.emptySelectedRow,
        });
    };

    restoreRep = (setID, rep) => {
        this.props.onRowDeselect();

        this.props.onPressRestore(setID, rep);

        this.setState({
            selectedRow: this.emptySelectedRow,
        });
    };

    handleSetDataRowSelect = item => {
        this.props.onRowSelect(item.setID, item.rep, item.repDisplay);

        this.setState({
            selectedRow: {
                columns: item.columns || null,
                removed: item.removed,
            },
        });
    };

    handleSetDataRowDeselect = () => {
        this.props.onRowDeselect();

        this.setState({
            selectedRow: this.emptySelectedRow,
        });
    };

    renderRowOverlayNumbers() {
        const columns = this.state.selectedRow.columns;

        if (!columns || !this.props.selectedRowDisplayRep) {
            return null;
        }
        if (is2dArray(columns)) {
            return (
                <View>
                    {columns.map((column, index) => {
                        const rowType =
                            column[column.length - 1][0].toUpperCase();
                        const itemNumber = this.props.selectedRowDisplayRep;
                        return (
                            <View key={`column-${index}`}>
                                <Text style={[styles.selectedData]}>
                                    {`${itemNumber}${rowType}`}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            );
        }
        return (
            <View>
                <View key={`data-column-${this.props.selectedRowDisplayRep}`}>
                    <Text style={[styles.selectedData]}>
                        {this.props.selectedRowDisplayRep}
                    </Text>
                </View>
            </View>
        );
    }

    renderRowOverlayButton() {
        const pressHandler =
            this.state.selectedRow !== this.emptySelectedRow
                ? this.state.selectedRow.removed
                    ? this.restoreRep
                    : this.removeRep
                : undefined;

        const buttonStyle = this.state.selectedRow.removed
            ? styles.restoreRepButton
            : styles.removeRepButton;

        const content = this.state.selectedRow.removed ? (
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
                {this.props.item.setID === this.props.selectedRowSetID && (
                    <TouchableOpacity
                        onPress={this.handleSetDataRowDeselect}
                        style={[
                            styles.overlay,
                            {
                                display: !isNaN(this.props.selectedRowRep)
                                    ? 'flex'
                                    : 'none',
                                marginTop: this.props.selectedRowDisplayRep
                                    ? (this.props.item.data.length -
                                          this.props.selectedRowDisplayRep) *
                                          65 +
                                      52
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
                )}

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
                                        onPress={() => {
                                            this.handleSetDataRowSelect(item);
                                        }}
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
        height: 65,
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
        height: 65,
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
        height: 65,
    },
});

const is2dArray = array => array.every(item => Array.isArray(item));

export default SetData;
