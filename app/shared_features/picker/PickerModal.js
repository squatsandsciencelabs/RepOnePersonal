import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function PickerModal(props) {
    const [selectedValue, setSelectedValue] = useState(props.selectedValue);

    useEffect(() => {
        setSelectedValue(props.selectedValue);
    }, [props.selectedValue]);

    function onValueChange(value) {
        setSelectedValue(value);
        props.selectValue(value);
    }

    function renderItems() {
        var count = 0;
        return props.items.map(function (item) {
            return (
                <Picker.Item
                    key={count++}
                    label={item.label}
                    value={item.value}
                />
            );
        });
    }

    if (Platform.OS === 'ios') {
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={props.isModalShowing}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => props.closeModal()}
                    />

                    <Picker
                        style={{ backgroundColor: 'white' }}
                        itemStyle={{ color: 'black' }}
                        selectedValue={selectedValue}
                        onValueChange={value => onValueChange(value)}>
                        {renderItems()}
                    </Picker>
                </View>
            </Modal>
        );
    } else {
        const color = props.color || 'rgba(47, 128, 237, 1)';
        const dropdownIconColor = props.dropdownIconColor || 'white';

        return (
            <Picker
                style={{ color: color }}
                dropdownIconColor={dropdownIconColor}
                selectedValue={selectedValue}
                onValueChange={value => onValueChange(value)}>
                {renderItems()}
            </Picker>
        );
    }
}
