import React from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    Image,
    View,
} from 'react-native';

export default props => {
    const [ isPress, setIsPress ] = React.useState(false);

    const touchProps = {
        activeOpacity: 1,
        underlayColor: 'white',
        onHideUnderlay: () => setIsPress(false),
        onShowUnderlay: () => setIsPress(true),
        onPress: () => true,
    };

    return (<TouchableHighlight {...touchProps} onPress={props.onPress} style={props.style}>
        <View style={[isPress ? styles.pressed : styles.normal, styles.button]}>
            {props.image ? <Image source={props.image} style={[isPress ? styles.pressedImage : styles.normalImage, styles.image]} /> : null}
            <Text style={isPress ? styles.pressedText : styles.normalText}>{props.text}</Text>
        </View>
    </TouchableHighlight>)
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 3,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    normal: {
        borderColor: 'rgba(47, 128, 237, 1)',
        backgroundColor: 'white',
    },
    pressed: {
        borderColor: 'rgba(47, 128, 237, 1)',
        backgroundColor: 'rgba(47, 128, 237, 1)',
    },
    image: {
        marginRight: 5,
    },
    normalImage: {
        tintColor: 'rgba(47, 128, 237, 1)'
    },
    pressedImage: {
        tintColor: 'white'
    },
    normalText: {
        color: 'rgba(47, 128, 237, 1)',
    },
    pressedText: {
        color: 'white',
    }
});
