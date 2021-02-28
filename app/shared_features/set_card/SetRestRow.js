import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import OutlineButton from 'app/shared_features/outline_button/OutlineButton';

const image = require('app/appearance/images/3d.png');

export default props => {
    if (props.item.hasOwnProperty('isWorkingSet') && props.item.isWorkingSet) {
        var marginTop = 15;
        var marginBottom = 15;
    } else if (props.item.isCollapsed) {
        var marginTop = 0;
        var marginBottom = 15;
    } else {
        var marginTop = 15;
        var marginBottom = 0;
    }

    const tappedButton = () => {
        Alert.alert('hi')
        // props.tappedButton(props.setID);
    };

    if (props.item.show3D) {
        var button =<OutlineButton
            style={styles.button}
            image={image}
            onPress={tappedButton}
            text='3D' />;
    } else {
        var button = null;
    }

    return (
        <View style={[styles.border, styles.container]}>
            <Text style={{textAlign: 'center', color: 'gray', marginBottom: marginBottom, marginTop: marginTop}}>{ props.item.rest }</Text>
            {button}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white',
        textAlign: 'center',
        position: 'relative',
    },
    border: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
    },
    button: {
        position: 'absolute',
        right: 5,
        bottom: 5,
    }
});
