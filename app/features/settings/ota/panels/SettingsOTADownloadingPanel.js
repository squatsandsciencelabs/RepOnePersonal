import React, { Component } from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTADownloadingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinValue: new Animated.Value(0),
        };
    }

    componentDidMount = () => {
        this.startImageRotateFunction();
    };

    componentWillUnmount = () => {
        this.state.spinValue.stopAnimation();
    };

    startImageRotateFunction = () => {
        Animated.loop(
            Animated.timing(this.state.spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
        ).start();
    };

    render() {
        return (
            <View style={SETTINGS_PANEL_STYLES.footer}>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.subtitleText,
                        { fontWeight: '500', marginTop: 10 },
                    ]}>
                    Version {this.props.firmwareVersion} downloading update...
                </Text>
                <Animated.Image
                    style={{
                        margin: 16,
                        transform: [
                            {
                                rotate: this.state.spinValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                }),
                            },
                        ],
                    }}
                    source={require('app/appearance/images/ellipse_install_firmware.png')}
                />
                <Text style={[SETTINGS_PANEL_STYLES.subtitleText]}>
                    Installing on{' '}
                    {this.props.connectedDevice &&
                        `#${this.props.connectedDevice}`}
                </Text>
                <Text
                    style={[
                        SETTINGS_PANEL_STYLES.footerCancelText,
                        { fontWeight: '500', marginTop: 25 },
                    ]}
                    onPress={this.props.cancelDownload.bind(this)}>
                    Cancel
                </Text>
            </View>
        );
    }
}

export default SettingsOTADownloadingPanel;
