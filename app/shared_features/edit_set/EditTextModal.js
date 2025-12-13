// TODO: consider splitting this component into two different ones rather than using if statements everywhere

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StatusBar,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Modal,
    FlatList,
    Platform,
} from 'react-native';
import Pill from 'app/shared_features/pill/Pill';
import { EDIT_MODAL_STYLES } from 'app/appearance/styles/GlobalStyles';

function EditTextModal(props) {
    const [text, setText] = useState(props.text || '');
    const [inputs, setInputs] = useState([]);
    const [setID, setSetID] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const usesSetID = props.hasOwnProperty('setID');
        if (usesSetID && props.setID === setID) {
            // wrong set, don't update
            return;
        }

        if (!props.isModalShowing) {
            // it's not showing, no point in updating it
            return;
        }

        // inputs
        if (props.inputs !== undefined) {
            var newInputs = [...props.inputs];
        } else {
            var newInputs = [];
        }
        setInputs(newInputs);

        // save set id
        if (usesSetID && props.setID !== null) {
            setSetID(props.setID);
        }

        // set text
        let newText = props.text;
        if (newText === null || newText === undefined) {
            newText = '';
        }
        setText(newText);

        // update suggestions
        _updateSuggestions(newText, newInputs, props.bias);
    }, [props.isModalShowing, props.setID, props.text, props.inputs, props.bias]);

    // HELPERS

    const _addNewPill = (input, resetText = false) => {
        // valid check
        if (inputs.includes(input) || input == '') {
            return;
        }

        props.addPill(setID);

        if (resetText) {
            var newText = '';
            setText(newText);
        } else {
            var newText = text;
        }

        let newInputs = [...inputs, input];
        setInputs(newInputs);
        _updateSuggestions(newText, newInputs);
    };

    const _removePill = (index) => {
        let inputsCopy = [...inputs];
        inputsCopy.splice(index, 1);
        setInputs(inputsCopy);
        _updateSuggestions(text, inputsCopy);
    };

    const _updateText = (input, bias = props.bias) => {
        setText(input);
        _updateSuggestions(input, inputs, bias);
    };

    const _updateSuggestions = (
        input = text,
        inputsParam = inputs,
        bias = null,
    ) => {
        if (props.multipleInput) {
            var newSuggestions = props.generateMultipleInputSuggestions(
                input,
                inputsParam,
            );
        } else {
            var newSuggestions = props.generateSingleInputSuggestions(
                input,
                bias,
            );
        }
        let suggestionsVM = newSuggestions.map(suggestion => {
            return { key: suggestion };
        });
        setSuggestions(suggestionsVM);
    };

    // ACTIONS

    const _onChangeText = (input) => {
        if (props.multipleInput && input.slice(-1) === '\n') {
            // enter tapped in multiline mode, update accordingly
            _addNewPill(text, true);
        } else {
            // update the text
            _updateText(input);
        }
    };

    const _tappedRow = (input) => {
        if (props.multipleInput) {
            _addNewPill(input, true);
        } else {
            // TODO: find a way to not repeat _tappedDone logic
            // NOTE: This is repeating _tappedDone logic because setState doesn't update immediately
            props.saveSetSingleInput(setID, input);
            props.closeModal();
        }
    };

    const _tappedDone = () => {
        if (props.multipleInput) {
            if (text) {
                var finalInputs = [...inputs, text];
            } else {
                var finalInputs = inputs;
            }
            props.saveSetMultipleInput(setID, finalInputs);
        } else {
            props.saveSetSingleInput(setID, text);
        }
        props.closeModal();
    };

    const _tappedEnter = () => {
        if (props.multipleInput) {
            // this is android only, iOS instead uses the \n check in onChangeText
            _addNewPill(text, true);
        } else {
            _tappedDone();
        }
    };

    const _tappedPill = (index) => {
        _removePill(index);
        props.tappedPill(setID);
    };

    // RENDER

    // TODO: grab the blue color for cancel from a global stylesheet
    const _renderNavigation = () => {
        return (
            <View style={{ backgroundColor: 'rgba(242, 242, 242, 1)' }}>
                <View style={styles.container}>
                    <View style={{ position: 'absolute', left: 0, top: 0 }}>
                        <TouchableOpacity
                            onPress={() =>
                                props.cancelModal(setID)
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
                            {props.title}
                        </Text>
                    </View>

                    <View style={{ position: 'absolute', right: 0, top: 0 }}>
                        <TouchableOpacity onPress={() => _tappedDone()}>
                            <View style={styles.nav}>
                                <Text style={[{ color: 'rgba(47, 128, 237, 1)' }]}>
                                    Done
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const _renderHeader = () => {
        if (!props.multipleInput) {
            return;
        }

        var pills = [];
        inputs.map((input, index) => {
            let position = pills.length;
            let pillText = input;
            pills.push(
                <TouchableOpacity
                    key={`pill-${index}`}
                    onPress={() => _tappedPill(position)}>
                    <Pill
                        text={pillText}
                        style={{ paddingRight: 5, paddingBottom: 3 }}
                    />
                </TouchableOpacity>,
            );
        });

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
    };

    const _renderTextField = () => {
        if (props.multipleInput) {
            var returnKeyType = 'go';
            if (
                inputs.includes(text) ||
                text == ''
            ) {
                var button = (
                    <View
                        style={[
                            { width: 50, height: 50, marginRight: 10 },
                            styles.addButton,
                            styles.disabled,
                        ]}>
                        <Text style={styles.addText}>Add</Text>
                    </View>
                );
            } else {
                var button = (
                    <TouchableOpacity onPress={() => _tappedEnter()}>
                        <View
                            style={[
                                { width: 50, height: 50, marginRight: 10 },
                                styles.addButton,
                            ]}>
                            <Text style={styles.addText}>Add</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
        } else {
            var returnKeyType = 'done';
            var button = null;
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <View
                    style={[
                        {
                            flex: 1,
                            height: 50,
                            marginHorizontal: 10,
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                        },
                    ]}>
                    <TextInput
                        style={styles.textField}
                        placeholderTextColor={'rgba(189, 189, 189, 1)'}
                        underlineColorAndroid={'transparent'}
                        editable={true}
                        autoFocus={true}
                        autoCapitalize={'none'}
                        placeholder={props.placeholder}
                        returnKeyType={returnKeyType}
                        value={text}
                        multiline={
                            Platform.os === 'ios'
                                ? props.multipleInput
                                : false
                        } //Android multiline screws up spacing
                        onSubmitEditing={() => _tappedEnter()}
                        onChangeText={inputText => _onChangeText(inputText)}
                        clearButtonMode={'while-editing'}
                    />
                </View>
                {button}
            </View>
        );
    };

    const _renderList = () => {
        let data = suggestions;

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
                ListHeaderComponent={_renderTopBorder}
                ListFooterComponent={_renderBottomBorder}
                renderItem={({ item }) => _renderRow(item)}
                ItemSeparatorComponent={_renderSeparator}
            />
        );
    };

    const _renderRow = (item) => {
        if (item.key === 'bug') {
            // hack to get bug pill working
            // TODO: make this generic rather than specific so you can have multiple pill types
            return (
                <TouchableHighlight onPress={() => _tappedRow(item.key)}>
                    <View
                        style={[
                            {
                                backgroundColor: 'white',
                                height: 50,
                                justifyContent: 'center',
                            },
                            styles.rowBorders,
                        ]}>
                        <Text style={{ marginHorizontal: 10, color: 'red' }}>
                            {item.key}
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        } else {
            return (
                <TouchableHighlight onPress={() => _tappedRow(item.key)}>
                    <View
                        style={[
                            {
                                backgroundColor: 'white',
                                height: 50,
                                justifyContent: 'center',
                            },
                            styles.rowBorders,
                        ]}>
                        <Text
                            style={{
                                marginHorizontal: 10,
                                color: 'rgba(77, 77, 77, 1)',
                            }}>
                            {item.key}
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        }
    };

    // TODO: move 242 gray from global stylesheet
    const _renderSeparator = () => {
        return (
            <View style={[{ backgroundColor: 'white' }, styles.rowBorders]}>
                <View
                    style={{
                        marginHorizontal: 10,
                        backgroundColor: 'rgba(242, 242, 242, 1)',
                        height: 1,
                    }}></View>
            </View>
        );
    };

    const _renderTopBorder = () => {
        return (
            <View style={{ backgroundColor: '#e0e0e0', flex: 1, height: 1 }} />
        );
    };

    const _renderBottomBorder = () => {
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
    };

    // TODO: move 242 gray from global stylesheet
    return (
        <Modal visible={props.isModalShowing} animationType="fade">
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: 'rgba(242, 242, 242, 1)',
                }}>
                {_renderNavigation()}
                {_renderHeader()}
                {_renderTextField()}
                {_renderList()}
            </View>
        </Modal>
    );
}

const styles = EDIT_MODAL_STYLES;

export default EditTextModal;
