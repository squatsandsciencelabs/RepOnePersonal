import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableHighlight,
    TouchableOpacity,
    Modal,
    FlatList,
    Platform,
} from 'react-native';
import Pill from 'app/shared_features/pill/Pill';
import {
    EDIT_MODAL_STYLES,
    HISTORY_STYLES,
} from 'app/appearance/styles/GlobalStyles';

class EditFilterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputs: [],
            options: this.props.options,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isModalShowing && !nextProps.isModalShowing) {
            // it's not showing, no point in updating it
            return;
        }

        // inputs
        const inputs =
            nextProps.inputs !== undefined ? [...nextProps.inputs] : [];
        const options = nextProps.options.filter(
            option => !inputs.includes(option),
        );

        this.setState({ inputs, options: options });
    }

    // HELPERS

    _addNewPill(input) {
        // valid check
        if (this.state.inputs.includes(input) || input == '') {
            return;
        }

        this.props.addPill();

        let inputs = [...this.state.inputs, input];

        const options = this.state.options.filter(
            option => !inputs.includes(option),
        );

        this.setState({
            inputs: inputs,
            options,
        });
    }

    _removePill(index) {
        let inputsCopy = [...this.state.inputs];
        inputsCopy.splice(index, 1);

        const options = this.props.options.filter(
            option => !inputsCopy.includes(option),
        );

        this.setState({
            inputs: inputsCopy,
            options,
        });
    }

    // ACTIONS
    _tappedRow(input) {
        if (this.props.multipleInput) {
            this._addNewPill(input, true);
        } else {
            this.props.saveSetSingleInput(input);
            this.props.closeModal();
        }
    }

    _tappedDone() {
        if (this.props.multipleInput) {
            const inputs = this.state.inputs;
            this.props.saveSetMultipleInput(inputs);
        }

        this.props.closeModal();
    }

    _tappedPill(index) {
        this._removePill(index);
        this.props.tappedPill();
    }

    // RENDER

    _renderNavigation() {
        return (
            <View>
                <View style={styles.container}>
                    <View style={{ position: 'absolute', left: 0, top: 0 }}>
                        <TouchableOpacity onPress={() => this.props.cancelModal()}>
                            <View style={styles.nav}>
                                <Text style={HISTORY_STYLES.tappableText}>
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
            </View>
        );
    }

    _renderHeader() {
        if (!this.props.multipleInput) {
            return;
        }

        var pills = [];

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
        const dataItem = item.fullName || item.key || item;

        return (
            <TouchableHighlight
                onPress={() => this._tappedRow(item.key || item)}>
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
                        {dataItem}
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

    _renderSeparator() {
        return (
            <View style={[{ backgroundColor: 'white' }, styles.rowBorders]}>
                <View
                    style={[
                        HISTORY_STYLES.editFilterModalBG,
                        {
                            marginHorizontal: 10,
                            height: 1,
                        },
                    ]}
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

    render() {
        return (
            <Modal visible={this.props.isModalShowing} animationType="fade">
                <View
                    style={[
                        {
                            flex: 1,
                            flexDirection: 'column',
                        },
                        HISTORY_STYLES.editFilterModalBG,
                    ]}>
                    {this._renderNavigation()}
                    {this._renderHeader()}
                    {this._renderList()}
                </View>
            </Modal>
        );
    }
}

const styles = EDIT_MODAL_STYLES;

export default EditFilterModal;
