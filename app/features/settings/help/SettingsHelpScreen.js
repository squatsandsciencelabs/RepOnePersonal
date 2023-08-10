import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

export default () => {
    return (
        <TouchableOpacity
            onPress={() =>
                Linking.openURL(
                    'https://www.reponestrength.com/help-and-tutorials',
                )
            }>
            <Text
                style={[
                    SETTINGS_PANEL_STYLES.tappableText,
                    {
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginTop: 20,
                        marginBottom: 10,
                    },
                ]}>
                Help and Tutorials →
            </Text>
        </TouchableOpacity>
    );
};
