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
            setID: null,
            rep: null,
            repDisplay: null,
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

    renderRowOverlayNumbers() {
        const columns = this.state.selectedRow.columns;

        if (!columns || !this.state.selectedRow.repDisplay) {
            return null;
        }
        if (is2dArray(columns)) {
            return (
                <View>
                    {columns.map((column, index) => {
                        const rowType =
                            column[column.length - 1][0].toUpperCase();
                        const itemNumber = this.state.selectedRow.repDisplay;
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
                <View key={`data-column-${this.state.selectedRow.repDisplay}`}>
                    <Text style={[styles.selectedData]}>
                        {this.state.selectedRow.repDisplay}
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
                onPress={pressHandler}
                style={buttonStyle}>
                {content}
            </TouchableOpacity>
        );
    }

    removeRep = () => {
        this.props.onPressRemove(
            this.state.selectedRow.setID,
            this.state.selectedRow.rep,
        );

        this.setState({
            selectedRow: this.emptySelectedRow,
        });
    };

    restoreRep = () => {
        this.props.onPressRestore(
            this.state.selectedRow.setID,
            this.state.selectedRow.rep,
        );

        this.setState({
            selectedRow: this.emptySelectedRow,
        });
    };

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
                <TouchableOpacity
                    onPress={() =>
                        this.setState({
                            selectedRow: this.emptySelectedRow,
                        })
                    }
                    style={[
                        styles.overlay,
                        {
                            display: this.state.selectedRow.repDisplay
                                ? 'flex'
                                : 'none',
                            marginTop: this.state.selectedRow.repDisplay
                                ? (this.props.item.data.length -
                                      this.state.selectedRow.repDisplay) *
                                      65 +
                                  52
                                : 0,
                        },
                    ]}>
                    <View style={styles.overlayContentWrapper}>
                        <View style={styles.overlayNumbersContainer}>
                            {this.renderRowOverlayNumbers()}
                        </View>

                        {this.renderRowOverlayButton()}
                    </View>
                </TouchableOpacity>

                {this.renderRowNumbers()}

                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    onScrollBeginDrag={() =>
                        this.setState({ selectedRow: this.emptySelectedRow })
                    }>
                    <View style={styles.scrollableContent}>
                        <SetDataLabelRow item={this.props.item.subheader} />

                        <View>
                            {this.props.item.data.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={`data-row-${index}`}
                                        activeOpacity={1}
                                        onPress={() => {
                                            this.setState({
                                                selectedRow: {
                                                    setID: item.setID,
                                                    rep: item.rep,
                                                    repDisplay: item.repDisplay,
                                                    columns:
                                                        item.columns || null,
                                                    removed: item.removed,
                                                },
                                            });
                                        }}
                                        style={styles.setDataRowWrapper}>
                                        <SetDataRow
                                            key={index}
                                            item={item}
                                            selected={
                                                this.state.selectedRow.rep ===
                                                item.rep
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
    },
    restoreRepButton: {
        backgroundColor: '#FDEEEE',
        width: 57,
        height: '100%',
        justifyContent: 'center',
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
            height: 7,
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
        paddingLeft: 46,
        backgroundColor: 'white',
        minWidth: '100%',
    },
    setDataRowWrapper: {
        height: 65,
    },
});

const is2dArray = array => array.every(item => Array.isArray(item));

export default SetData;
