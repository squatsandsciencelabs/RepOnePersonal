import React from 'react';
import { View, StyleSheet } from 'react-native';

export default props => {
    const innerSize = props.size * 0.8;
    return (
        <View
            style={[
                props.style,
                styles.container,
                {
                    borderRadius: props.size * 0.5,
                    width: props.size,
                    height: props.size,
                    backgroundColor: props.color,
                },
            ]}>
            <View
                style={[
                    styles.innerCircle,
                    {
                        borderColor: 'white',
                        width: innerSize,
                        height: innerSize,
                        borderRadius: innerSize * 0.5,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        color: 'rgba(0, 0, 0, 0)',
        borderWidth: 1,
    },
});
