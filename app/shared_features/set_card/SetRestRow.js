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

    if (props.item.show3D) {
        var button = <OutlineButton
            image={image}
            onPress={tappedButton}
            text='3D View' />
    } else {
        var button = null;
    }

    return (
        <View style={[styles.border, {flex:1, flexDirection: 'row', alignItems:'stretch', backgroundColor:'white'}]}>
            <Text style={{flex: 1, textAlign: 'center', color: 'gray', marginBottom: marginBottom, marginTop: marginTop}}>{ props.item.rest }</Text>
            {button}
        </View>
    );
};

const styles = StyleSheet.create({
    border: {
        borderColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
    },
});
