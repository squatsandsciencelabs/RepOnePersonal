import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert,
    Platform,
}  from 'react-native';

export default function (props) {
    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={props.isModalShowing} >

        </Modal>
    );
}
