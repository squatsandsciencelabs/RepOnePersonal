import React, { Component } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SensorSettingsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true,
        };
    }

    handleHeaderPress = () => {
        this.setState({ isCollapsed: !this.state.isCollapsed });
    };

    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.panel}>
                <TouchableOpacity onPress={this.handleHeaderPress}>
                    <View
                        style={[
                            SETTINGS_PANEL_STYLES.header,
                            {
                                position: 'relative',
                            },
                        ]}>
                        <Text style={SETTINGS_PANEL_STYLES.headerText}>
                            {this.props.sensorName} Settings
                        </Text>
                        <Image
                            style={[
                                styles.arrowIcon,
                                {
                                    transform: this.state.isCollapsed
                                        ? [{ rotate: '0deg' }]
                                        : [{ rotate: '180deg' }],
                                },
                            ]}
                            source={require('app/appearance/images/icon_settings_device_arrow.png')}
                        />
                    </View>
                </TouchableOpacity>
                {!this.state.isCollapsed && <View>{this.props.children}</View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    labelText: {
        fontSize: 16,
        color: 'rgba(77, 77, 77, 1)',
    },
    section: {
        marginTop: 35,
    },
    arrowIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
});

export default SensorSettingsCard;
