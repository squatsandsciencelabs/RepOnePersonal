// TODO: Refactor this so that the panels are screens rather than passing props manually

import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { OTAStatus } from 'app/redux/reducers/OTAReducer';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import SettingsOTAUpdateAppPanel from './panels/SettingsOTAUpdateAppPanel';
import SettingsOTAAvailablePanel from './panels/SettingsOTAAvailablePanel';
import SettingsOTADownloadFailedPanel from './panels/SettingsOTADownloadFailedPanel';
import SettingsOTADownloadingPanel from './panels/SettingsOTADownloadingPanel';
import SettingsOTAInstallingPanel from './panels/SettingsOTAInstallingPanel';
import SettingsOTAReadyPanel from './panels/SettingsOTAReadyPanel';

class SettingsOTAPanel extends Component {

    _renderContents() {
        switch ( this.props.status ) {
            case OTAStatus.UPDATE_APP:
                return <SettingsOTAUpdateAppPanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        firmwareDescription={this.props.firmwareDescription}
                        />
            case OTAStatus.AVAILABLE:
                return <SettingsOTAAvailablePanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        firmwareDescription={this.props.firmwareDescription}
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
                        progress={this.props.progress}
                        />
            default:
                return null;
        }
    }

    // TODO: bold the version numbers
    render() {
        return (
            <View style={ [SETTINGS_PANEL_STYLES.panel, { flex: 1 }] }>
                <View style={ SETTINGS_PANEL_STYLES.header }>
                    <Text style={ SETTINGS_PANEL_STYLES.headerText }>
                        Update Firmware
                    </Text>
                </View>
                {this._renderContents()}
            </View>
        );
    }
}

export default SettingsOTAPanel;