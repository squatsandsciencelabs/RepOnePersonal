import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Fragment } from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class SettingsOTAReadyPanel extends Component {

    render() {
        const install = this.props.connectedDevice ? (<Fragment>
            <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50}]}
                onPress={this.props.install.bind(this)}>
                    <Text style={SETTINGS_PANEL_STYLES.buttonText}>Install on RepOne #{this.props.connectedDevice}</Text>
            </TouchableOpacity>
            <Text style={ SETTINGS_PANEL_STYLES.footerCancelText }>
                To install on another RepOne unit, connect to it below.
            </Text>
        </Fragment>) : (
            <Text style={ SETTINGS_PANEL_STYLES.footerCancelText }>
                To install on a RepOne unit, connect to it below.
            </Text>
        );

        return (
            <View style={ SETTINGS_PANEL_STYLES.footer }>
                <Text style={ SETTINGS_PANEL_STYLES.subtitleText }>
                    Version {this.props.firmwareVersion} files downloaded
                </Text>
                {install}
                <Text style={SETTINGS_PANEL_STYLES.tappableText} onPress={this.props.deleteDownload.bind(this)}>
                    I'm done, delete update files
                </Text>
            </View>
        );
    }

}

export default SettingsOTAReadyPanel;
