import React from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import OutlineButton from 'app/shared_features/outline_button/OutlineButton';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

const image = require('app/appearance/images/3d.png');

export default props => {
    if (props.item.hasOwnProperty('isWorkingSet') && props.item.isWorkingSet) {
        var marginTop = 15;
        var marginBottom = 15;
    } else if (props.item.isCollapsed) {
        var marginTop = 0;
        var marginBottom = 10;
    } else {
        var marginTop = 5;
        var marginBottom = 10;
    }

    const tapped3DButton = () => {
        props.open3D(props.item.setID);
    };

    const tappedDeleteButton = () => {
        props.onPressDelete(props.item.setID);
    };

    if (props.item.show3D) {
        var button = (
            <OutlineButton
                style={styles.accessoryButton}
                image={image}
                onPress={tapped3DButton}
                text="3D"
            />
        );
    } else if (!props.item.isWorkingSet && !props.item.isCollapsed) {
        var button = (
            <TouchableOpacity
                onPress={tappedDeleteButton}
                style={styles.accessoryButton}>
                <Text style={styles.deleteText}>Delete Set</Text>
            </TouchableOpacity>
        );
    } else {
        var button = null;
    }

    return (
        <View style={[styles.border, styles.container]}>
            <Text
                style={{
                    textAlign: 'center',
                    color: 'gray',
                    marginBottom,
                    marginTop,
                }}>
                {props.item.rest}
            </Text>
            {button}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        textAlign: 'center',
        position: 'relative',
        marginBottom: 15,
    },
    border: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },
    accessoryButton: {
        position: 'absolute',
        right: 5,
        bottom: 5,
    },
    deleteText: {
        color: 'red',
        padding: 5,
    },
});
