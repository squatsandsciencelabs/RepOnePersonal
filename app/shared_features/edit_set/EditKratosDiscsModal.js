// TODO: consider splitting this component into two different ones rather than using if statements everywhere

import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableHighlight,
    TouchableOpacity,
    Modal,
    StyleSheet,
    FlatList,
    Platform,
} from 'react-native';
import * as Device from 'app/utility/Device';
import Pill from 'app/shared_features/pill/Pill';

// EditKratosDiscsModal is basically a EditTextModal component, but without text input logic

// To allow dupe values provide stackValues = true prop
// When dupe values are allowed, for pills with value > 1 the number of items is also displayed

class EditKratosDiscsModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // for regular inputs (each value is unique)
            inputs: [],
            // for dupe values
            stackedInputs: [],
            options: this.props.options,
        };
    }

    componentWillReceiveProps(nextProps) {
        const usesSetID = this.props.hasOwnProperty('setID');
        if (usesSetID && nextProps.setID === this.props.setID) {
            // wrong set, don't update
            return;
        }

        if (!this.props.isModalShowing && !nextProps.isModalShowing) {
            // it's not showing, no point in updating it
            return;
        }

        // inputs
        if (nextProps.inputs !== undefined) {
            var inputs = [...nextProps.inputs];
        } else {
            var inputs = [];
        }

        if (nextProps.stackedInputs !== undefined) {
            var stackedInputs = [...nextProps.stackedInputs];
        } else {
            var stackedInputs = [];
        }

        this.setState({ inputs, stackedInputs, options: nextProps.options });

        // save set id
        if (usesSetID && nextProps.setID !== null) {
            this.setState({ setID: nextProps.setID });
        }
    }

    // HELPERS

    _addNewPill(input) {
        // valid check
        if (
            (this.state.inputs.includes(input) && !this.props.stackValues) ||
            input == ''
        ) {
            return;
        }

        this.props.addPill(this.state.setID);

        if (this.props.stackValues) {
            let indexOfInput = this.state.stackedInputs.findIndex(
                i => Object.keys(i)[0] === input,
            );

            let stackedInputs = [...this.state.stackedInputs];

            if (indexOfInput > -1) {
                const [key, value] = Object.entries(
                    stackedInputs[indexOfInput],
                )[0];
                stackedInputs[indexOfInput] = { [key]: value + 1 };
            } else {
                stackedInputs.push({ [input]: 1 });
            }

            // sorting the pills to appear in the same order as the options
            stackedInputs.sort((a, b) => {
                const keyA = Object.keys(a)[0];
                const keyB = Object.keys(b)[0];

                return (
                    this.state.options.findIndex(
                        option => option.key === keyA,
                    ) -
                    this.state.options.findIndex(option => option.key === keyB)
                );
            });

            this.setState({
                stackedInputs: stackedInputs,
            });
        } else {
            let inputs = [...this.state.inputs, input];
            this.setState({
                inputs: inputs,
            });
        }
    }

    _removePill(index) {
        if (this.props.stackValues) {
            const [key, value] = Object.entries(
                this.state.stackedInputs[index],
            )[0];
            const newValue = value - 1;
            if (newValue <= 0) {
                const stackedInputs = [...this.state.stackedInputs];

                stackedInputs.splice(index, 1);

                this.setState({
                    stackedInputs,
                });
            } else {
                const stackedInputs = [...this.state.stackedInputs];
                stackedInputs[index] = { [key]: newValue };
                this.setState({
                    stackedInputs: stackedInputs,
                });
            }
        } else {
            let inputsCopy = [...this.state.inputs];
            inputsCopy.splice(index, 1);
            this.setState({
                inputs: inputsCopy,
            });
        }
    }

    _getName = acronym => {
        return this.props.nameTransform
            ? this.props.nameTransform(acronym)
            : acronym;
    };

    // ACTIONS
    _tappedRow(input) {
        if (this.props.multipleInput) {
            this._addNewPill(input, true);
        } else {
            // TODO: find a way to not repeat _tappedDone logic
            // NOTE: This is repeating _tappedDone logic because setState doesn't update immediately
            this.props.saveSetSingleInput(this.state.setID, input);
            this.props.closeModal();
        }
    }

    _tappedDone() {
        if (this.props.multipleInput) {
            const inputs = this.props.stackValues
                ? this.state.stackedInputs
                : this.state.inputs;

            this.props.saveSetMultipleInput(this.state.setID, inputs);
        }

        this.props.closeModal();
    }

    _tappedPill(index) {
        this._removePill(index);
        this.props.tappedPill(this.state.setID);
    }

    // RENDER

    // TODO: grab the blue color for cancel from a global stylesheet
    _renderNavigation() {
        if (Device.hasNotch()) {
            var statusBar = (
                <View>
                    <StatusBar
                        backgroundColor="white"
                        barStyle="dark-content"
                    />
                </View>
            );
        } else if (Platform.OS === 'ios') {
            var statusBar = (
                <View
                    style={{
                        height: 20,
                        width: 9001,
                        backgroundColor: 'black',
                    }}
                />
            );
        } else {
            var statusBar = null;
        }

        return (
            <View style={styles.container}>
                {statusBar}

                <View style={{ position: 'absolute', left: 0, top: 0 }}>
                    <TouchableOpacity
                        onPress={() =>
                            this.props.cancelModal(this.state.setID)
                        }>
                        <View style={styles.nav}>
                            <Text style={[{ color: 'rgba(47, 128, 237, 1)' }]}>
                                Cancel
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.navTitle}>
                    <Text style={{ color: 'rgba(77, 77, 77, 1)' }}>
                        {this.props.title}
                    </Text>
                </View>

                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                    <TouchableOpacity onPress={() => this._tappedDone()}>
                        <View style={styles.nav}>
                            <Text style={[{ color: 'rgba(47, 128, 237, 1)' }]}>
                                Done
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _renderHeader() {
        if (!this.props.multipleInput) {
            return;
        }

        var pills = [];
        if (this.props.stackValues) {
            const inputValues = this.state.stackedInputs;
            if (inputValues.length > 0) {
                inputValues.map((inputValue, index) => {
                    let position = pills.length;
                    const [text, value] = Object.entries(inputValue)[0];
                    pills.push(
                        <TouchableOpacity
                            key={`pill-${index}`}
                            onPress={() => this._tappedPill(position)}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#eeeee',
                                    marginRight: 10,
                                }}>
                                <Pill
                                    noTextTransform={this.props.noTextTransform}
                                    text={text}
                                    style={{
                                        paddingRight: 4,
                                        paddingBottom: 3,
                                    }}
                                />
                                {/* show the number of items if amount > 1 */}
                                {value > 1 && (
                                    <Text style={{ color: 'blue' }}>
                                        {value}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>,
                    );
                });
            }
        } else {
            this.state.inputs.map((input, index) => {
                let position = pills.length;
                let text = input;
                pills.push(
                    <TouchableOpacity
                        key={`pill-${index}`}
                        onPress={() => this._tappedPill(position)}>
                        <Pill
                            noTextTransform={this.props.noTextTransform}
                            text={text}
                            style={{ paddingRight: 5, paddingBottom: 3 }}
                        />
                    </TouchableOpacity>,
                );
            });
        }

        if (pills.length === 0) {
            return;
        } else {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingLeft: 10,
                        paddingRight: 5,
                        marginBottom: 5,
                    }}>
                    {pills}
                </View>
            );
        }
    }

    _renderList() {
        let data = this.state.options;

        if (data && data.length === 0) {
            return null;
        }

        return (
            <FlatList
                style={{ padding: 10 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                initialNumToRender={13}
                data={data}
                ListHeaderComponent={this._renderTopBorder}
                ListFooterComponent={this._renderBottomBorder}
                renderItem={({ item }) => this._renderRow(item)}
                ItemSeparatorComponent={this._renderSeparator}
            />
        );
    }

    _renderRow(item) {
        // Show item.key if the full name is not provided
        const text = item.fullName || item.key;

        return (
            <TouchableHighlight onPress={() => this._tappedRow(item.key)}>
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            backgroundColor: 'white',
                            height: 50,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        },
                        styles.rowBorders,
                    ]}>
                    <Text
                        style={{
                            marginHorizontal: 10,
                            color: 'rgba(77, 77, 77, 1)',
                        }}>
                        {text}
                    </Text>
                    {item.description && (
                        <Text
                            style={{
                                marginHorizontal: 10,
                                color: 'rgba(130, 130, 130, 1)',
                            }}>
                            {item.description}
                        </Text>
                    )}
                </View>
            </TouchableHighlight>
        );
    }

    // TODO: move 242 gray from global stylesheet
    _renderSeparator() {
        return (
            <View style={[{ backgroundColor: 'white' }, styles.rowBorders]}>
                <View
                    style={{
                        marginHorizontal: 10,
                        backgroundColor: 'rgba(242, 242, 242, 1)',
                        height: 1,
                    }}
                />
            </View>
        );
    }

    _renderTopBorder() {
        return (
            <View style={{ backgroundColor: '#e0e0e0', flex: 1, height: 1 }} />
        );
    }

    _renderBottomBorder() {
        return (
            <View
                style={{
                    backgroundColor: '#e0e0e0',
                    flex: 1,
                    height: 1,
                    marginBottom: 20,
                }}
            />
        );
    }

    // TODO: move 242 gray from global stylesheet
    render() {
        return (
            <Modal visible={this.props.isModalShowing} animationType="fade">
                <View
                    style={{
                        flex: 1,
                        paddingTop: Device.hasNotch() ? 40 : 0,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(242, 242, 242, 1)',
                    }}>
                    {this._renderNavigation()}
                    {this._renderHeader()}
                    {this._renderList()}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    textField: {
        height: 35,
        margin: 10,
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 14,
        paddingBottom: Platform.os === 'ios' ? 0 : 10,
    },
    container: {
        height: Platform.OS === 'ios' && !Device.hasNotch() ? 70 : 50,
        alignItems: 'center',
    },
    nav: {
        paddingTop: Platform.OS === 'ios' && !Device.hasNotch() ? 35 : 15,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    navTitle: {
        paddingTop: 15,
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(47, 128, 237, 1)',
        borderRadius: 5,
    },
    disabled: {
        opacity: 0.3,
    },
    addText: {
        color: 'white',
    },
    rowBorders: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
});

export default EditKratosDiscsModal;
