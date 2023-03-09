import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Linking,
} from 'react-native';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import VersionCheck from 'react-native-version-check';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

// "itms-apps://itunes.apple.com/us/app/repone-station/id1455246807?mt=8"

class SettingsOTAUpdateAppPanel extends Component {
    async openAppStore() {
        const url = await VersionCheck.getStoreUrl({
            appID: OpenBarbellConfig.appStoreId,
            packageName: OpenBarbellConfig.playStorePackageName,
        });
        Linking.openURL(url);
    }

    render() {
        let deviceFirmwareText = (
            <Text style={styles.description}>
                Connect a RepOne Sensor to compare versions.
            </Text>
        );
        if (this.props.deviceFirmwareVersion) {
            deviceFirmwareText = (
                <Text style={styles.description}>
                    The connected RepOne Sensor is{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                        Version {this.props.deviceFirmwareVersion}
                    </Text>
                </Text>
            );
        }
        return (
            <View>
                <View style={{}}>
                    <Text style={styles.description}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Version {this.props.firmwareVersion}
                        </Text>{' '}
                        {this.props.firmwareDescription}
                    </Text>
                </View>
                {deviceFirmwareText}
                <Text style={styles.upgradeDescription}>
                    You must update your app before installing the new firmware.
                </Text>
                <TouchableOpacity
                    style={[
                        SETTINGS_PANEL_STYLES.blueButton,
                        {
                            height: 50,
                            width: 200,
                            marginTop: 10,
                            marginBottom: 10,
                            backgroundColor: 'rgba(33, 150, 83, 1)',
                            borderColor: 'rgba(33, 150, 83, 1)',
                        },
                    ]}
                    onPress={this.openAppStore.bind(this)}>
                    <Text style={SETTINGS_PANEL_STYLES.buttonText}>
                        Update mobile app
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    description: {
        textAlign: 'left',
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 14,
        paddingTop: 10,
        paddingBottom: 10,
    },
    upgradeDescription: {
        color: 'rgba(33, 150, 83, 1)',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default SettingsOTAUpdateAppPanel;
