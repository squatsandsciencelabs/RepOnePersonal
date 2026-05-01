import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

class PickerModal extends Component {
    // ACTIONS

    _onValueChange(value) {
        this.props.selectValue(value);
    }

    _close() {
        this.props.closeModal();
    }

    // RENDER

    render() {
        if (Platform.OS === 'ios') {
            return (
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.props.isModalShowing}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => this._close()}></TouchableOpacity>

                        <Picker
                            style={{ backgroundColor: 'white' }}
                            itemStyle={{ color: 'black' }}
                            selectedValue={this.props.selectedValue}
                            onValueChange={value => this._onValueChange(value)}>
                            {this._renderItems()}
                        </Picker>
                    </View>
                </Modal>
            );
        } else {
            const color = this.props.color || 'rgba(47, 128, 237, 1)';
            const dropdownIconColor = this.props.dropdownIconColor || 'white';

            return (
                <Picker
                    style={{
                        color: color,
                    }}
                    dropdownIconColor={dropdownIconColor}
                    selectedValue={this.props.selectedValue}
                    onValueChange={value => this._onValueChange(value)}>
                    {this._renderItems()}
                </Picker>
            );
        }
    }

    _renderItems() {
        var count = 0;
        return this.props.items.map(function (item) {
            return (
                <Picker.Item
                    key={count++}
                    label={item.label}
                    value={item.value}
                />
            );
        });
    }
}

export default PickerModal;
