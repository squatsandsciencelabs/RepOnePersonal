import { Linking, Text, TouchableOpacity } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import React, { Component } from 'react';

class TextLink extends Component {
    render() {
        return (
            <TouchableOpacity onPress={() => Linking.openURL(this.props.link)}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.tappableText,
                        { ...this.props.style },
                    ]}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        );
    }
}

export default TextLink;
