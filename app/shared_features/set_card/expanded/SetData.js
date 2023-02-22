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

        this.state = {
            selectedRow: {
                setID: null,
                rep: null,
                repDisplay: null,
                columns: null,
                removed: false,
            },
        };

        this.displayData = [...this.props.item.items].reverse();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.item !== this.props.item) {
            this.displayData = [...this.props.item.items].reverse();
        }
    }

    renderColumns(columns) {
        return (
            <View>
                {columns.map((column, index) => {
                    const rowType = column[column.length - 1][0].toUpperCase();
                    const itemNumber = this.state.selectedRow.repDisplay || '';
                    return (
                        <View style={styles.itemContainer}>
                            <Text style={[styles.selectedData]}>
                                {`${itemNumber}${rowType}`}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    }

    renderRowButton() {
        if (this.state.selectedRow.removed) {
            return (
                <View
                    style={{
                        backgroundColor: '#FDEEEE',
                        width: 57,
                        height: '100%',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            color: '#EB5757',
                            fontWeight: '500',
                            fontSize: 10,
                            lineHeight: 12,
                            width: 57,
                            textAlign: 'center',
                        }}>
                        RESTORE REP
                    </Text>
                </View>
            );
        }
        return (
            <View
                style={{
                    backgroundColor: '#FDEEEE',
                    width: 57,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={require('app/appearance/images/cancel_set_row_selection.png')}
                />
            </View>
        );
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}>
                <TouchableOpacity
                    onPress={() =>
                        this.setState({
                            selectedRow: {
                                setID: null,
                                rep: null,
                                repDisplay: null,
                                columns: null,
                                removed: false,
                            },
                        })
                    }
                    style={{
                        display: this.state.selectedRow.repDisplay
                            ? 'flex'
                            : 'none',
                        position: 'absolute',
                        left: 0,
                        marginTop: this.state.selectedRow.repDisplay
                            ? (this.props.item.items.length -
                                  this.state.selectedRow.repDisplay) *
                                  65 +
                              52
                            : 0,
                        backgroundColor: 'rgba(235, 87, 87, 0.1)',
                        width: '100%',
                        height: 65,
                        zIndex: 2,
                    }}>
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                zIndex: 2,
                                flex: 1,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    backgroundColor: '#FDEEEE',
                                    width: 46,
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                {this.state.selectedRow.columns &&
                                    this.renderColumns(
                                        this.state.selectedRow.columns,
                                    )}
                            </View>

                            {this.renderRowButton()}
                        </View>
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        zIndex: 1,
                        paddingTop: 50,
                        width: 46,
                        backgroundColor: 'white',
                    }}>
                    {this.displayData.map(data => {
                        return (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 65,
                                }}>
                                <Text
                                    style={{
                                        zIndex: 1,
                                        fontWeight: '300',
                                        color: '#BDBDBD',
                                        fontSize: 24,
                                    }}>
                                    {data.repDisplay}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <ScrollView horizontal={true}>
                    <View style={{ flex: 1, paddingLeft: 46 }}>
                        <SetDataLabelRow item={this.props.item.subheader} />

                        {this.displayData.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            selectedRow: {
                                                setID: item.setID,
                                                rep: item.rep,
                                                repDisplay: item.repDisplay,
                                                columns: item.columns || null,
                                                removed: item.removed,
                                            },
                                        });
                                    }}
                                    style={{
                                        height: 65,
                                    }}>
                                    <SetDataRow key={index} item={item} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    data: {
        textAlign: 'left',
        color: 'rgba(77, 77, 77, 1)',
    },
    selectedData: {
        color: '#EB5757',
    },
});

export default SetData;
