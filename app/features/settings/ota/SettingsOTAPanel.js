// TODO: Refactor this so that the panels are screens rather than passing props manually

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { OTAStatus } from 'app/redux/reducers/OTAReducer';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import SettingsOTAAvailablePanel from './panels/SettingsOTAAvailablePanel';
import SettingsOTADownloadFailedPanel from './panels/SettingsOTADownloadFailedPanel';
import SettingsOTADownloadingPanel from './panels/SettingsOTADownloadingPanel';
import SettingsOTAInstallFailedPanel from './panels/SettingsOTAInstallFailedPanel';
import SettingsOTAInstallingPanel from './panels/SettingsOTAInstallingPanel';
import SettingsOTAInstallSucceededPanel from './panels/SettingsOTAInstallSucceededPanel';
import SettingsOTAReadyPanel from './panels/SettingsOTAReadyPanel';

class SettingsOTAPanel extends Component {

    _renderContents() {
        switch ( this.props.status ) {
            case OTAStatus.AVAILABLE:
                return <SettingsOTAAvailablePanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        download={this.props.download}
                        />;
            case OTAStatus.DOWNLOADING:
                return <SettingsOTADownloadingPanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        cancelDownload={this.props.cancelDownload}
                        />
            case OTAStatus.DOWNLOAD_FAILED:
                return <SettingsOTADownloadFailedPanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        download={this.props.download}
                        cancelDownload={this.props.cancelDownload}
                        />
            case OTAStatus.READY:
                return <SettingsOTAReadyPanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        connectedDevice={this.props.connectedDevice}
                        deleteDownload={this.props.deleteDownload}
                        install={this.props.install}
                        />
            case OTAStatus.INSTALLING:
                return <SettingsOTAInstallingPanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        connectedDevice={this.props.connectedDevice}
                        deleteDownload={this.props.deleteDownload}
                        cancelInstall={this.props.cancelInstall}
                        />
            case OTAStatus.INSTALL_FAILED:
                return <SettingsOTAInstallFailedPanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        connectedDevice={this.props.connectedDevice}
                        deleteDownload={this.props.deleteDownload}
                        install={this.props.install}
                        cancelInstall={this.props.cancelInstall}
                        />
            case OTAStatus.INSTALL_SUCCEEDED:
                return <SettingsOTAInstallSucceededPanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        connectedDevice={this.props.connectedDevice}
                        deleteDownload={this.props.deleteDownload}
                        />
            default:
                return null;
        }
    }

    // TODO: bold the version numbers
    render() {
        const deviceFirmwareText = this.props.deviceFirmwareVersion ? `The connected RepOne unit is version ${this.props.deviceFirmwareVersion}` : 'Connect a device to compare versions';
        return (
            <View style={ [SETTINGS_PANEL_STYLES.panel, { flex: 1 }] }>
                <View style={ SETTINGS_PANEL_STYLES.header }>
                    <Text style={ SETTINGS_PANEL_STYLES.headerText }>
                        Update Firmware
                    </Text>
                </View>
                <View style={{paddingTop: 10, paddingBottom: 16}}>
                    <Text style={ styles.description }>
                        The latest version is {this.props.firmwareVersion}
                    </Text>
                    <Text style={ styles.description }>
                        {deviceFirmwareText}
                    </Text>
                </View>
                {this._renderContents()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    description: {
        textAlign: 'left',
        color: 'rgba(77, 77, 77, 1)',
        fontSize: 14,
    },
});

export default SettingsOTAPanel;