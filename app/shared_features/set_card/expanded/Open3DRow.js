import React from 'react';
import {
    View,
    StyleSheet,
    Alert
} from 'react-native';

import OutlineButton from 'app/shared_features/outline_button/OutlineButton';

// TODO: do I make this have bool for viisble butt, or do I have that be a separate view altogether?

const image = require('app/appearance/images/3d.png');

export default props => {

    const tappedButton = () => {
        Alert.alert('hi')
        // props.tappedButton(props.setID);
    };

    return (<View style={styles.container}>
        <View style={styles.border} />
        <OutlineButton
            image={image}
            onPress={tappedButton}
            text='3D View' />
    </View>);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',    
        position: 'relative',
        height: 30,
        backgroundColor: 'white',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#e0e0e0',
    },
    border: {
        backgroundColor: '#e0e0e0',
        width: '100%',
        height: 1,
        position: 'absolute',
    },
    button: {
        width: 100,
    }
});
