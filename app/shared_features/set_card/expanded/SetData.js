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
// CE - both concentric and eccentric data
const ROW_HEIGHT_C_E = 65;
const ROW_HEIGHT = 40;

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
        let overlayStyles = styles.overlayHeight;
        let leftShadowStyles = styles.leftShadowHeight;

        if (this.props.item.deviceType === 'Kratos') {
            overlayStyles = styles.overlayHeightCE;
            leftShadowStyles = styles.leftShadowHeightCE;
        }

        const shadowWidth = this.props.selectedRowIsRemoved
            ? styles.restoreButton
            : styles.removeButton;

        if (this.props.item.setID === this.props.selectedRowSetID) {
            return (
                <TouchableOpacity
                    onPress={this.handleSetDataRowDeselect}
                    style={[
                        styles.overlay,
                        overlayStyles,
                        {
                            marginTop: this.props.selectedRowDisplayRep
                                ? getOverlayTopPosition(
                                      this.props.item.data.length,
                                      this.props.selectedRowDisplayRep,
                                      this.props.item.repsAreChronological,
                                      this.props.item.deviceType,
                                  )
                                : 0,
                        },
                    ]}>
                    <View style={styles.overlayContentWrapper}>
                        <View style={styles.overlayNumbersContainer}>
                            {this.renderRowOverlayNumbers()}
                        </View>
                        <View
                            style={[
                                styles.leftShadow,
                                leftShadowStyles,
                                shadowWidth,
                            ]}
                        />
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
        const overlayNumbersStyle =
            this.props.item.deviceType === 'Kratos'
                ? [styles.selectedData]
                : [styles.selectedData, styles.selectedDataBigNumber];

        return (
            <View>
                {this.props.selectedRowOverlayNumbers.map((column, index) => {
                    return (
                        <View
                            key={`overlay-numbers-${this.props.selectedRowDisplayRep}-${index}`}>
                            <Text style={overlayNumbersStyle}>{column}</Text>
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
        const rowNumberWrapperStyles =
            this.props.item.deviceType === 'Kratos'
                ? styles.rowNumberWrapperCE
                : styles.rowNumberWrapper;

        return (
            <View style={styles.rowNumbersWrapper}>
                {this.props.item.data.map(data => {
                    return (
                        <View
                            style={rowNumberWrapperStyles}
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
        const setDataRowWrapperStyles =
            this.props.item.deviceType === 'Kratos'
                ? styles.setDataRowWrapperCE
                : styles.setDataRowWrapper;
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
                                        style={setDataRowWrapperStyles}>
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
    selectedDataBigNumber: {
        fontSize: 24,
        fontWeight: '300',
    },
    removeRepButton: {
        backgroundColor: '#FDEEEE',
        width: 45,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'absolute',
        paddingRight: 15,
        right: 0,
    },
    restoreRepButton: {
        backgroundColor: '#FDEEEE',
        width: 75,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'absolute',
        right: 0,
    },
    restoreRepButtonText: {
        color: '#EB5757',
        fontWeight: '500',
        fontSize: 10,
        lineHeight: 12,
        width: 55,

        textAlign: 'center',
        fontFamily: 'RobotoCondensed-Regular',
        paddingRight: 15,
    },
    overlay: {
        position: 'absolute',
        left: 0,
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        width: '100%',
        zIndex: 2,
    },
    overlayHeightCE: {
        height: ROW_HEIGHT_C_E,
    },
    overlayHeight: {
        height: ROW_HEIGHT,
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
        paddingTop: SUBHEADER_HEIGHT,
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

    removeButton: {
        width: 45,
    },
    restoreButton: {
        width: 75,
    },
    leftShadow: {
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
    leftShadowHeight: {
        height: 25,
    },
    leftShadowHeightCE: {
        height: 55,
    },
    rowNumberWrapperCE: {
        alignItems: 'center',
        justifyContent: 'center',
        height: ROW_HEIGHT_C_E,
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
    setDataRowWrapperCE: {
        height: ROW_HEIGHT_C_E,
    },
    setDataRowWrapper: {
        height: ROW_HEIGHT,
    },
});

const is2dArray = array => array.every(item => Array.isArray(item));

const getOverlayTopPosition = (
    items,
    displayRep,
    isChronological,
    deviceType,
) => {
    const rowHeight = deviceType === 'Kratos' ? ROW_HEIGHT_C_E : ROW_HEIGHT;
    return isChronological
        ? (displayRep - 1) * rowHeight + SUBHEADER_HEIGHT
        : (items - displayRep) * rowHeight + SUBHEADER_HEIGHT;
};

export default SetData;
