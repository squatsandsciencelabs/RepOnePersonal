// TODO: Refactor this so that the panels are screens rather than passing props manually

import React, { Component } from 'react';

import { OTAStatus } from 'app/redux/reducers/OTAReducer';
import SettingsOTAAvailablePanel from './panels/SettingsOTAAvailablePanel';
import SettingsOTADownloadFailedPanel from './panels/SettingsOTADownloadFailedPanel';
import SettingsOTADownloadingPanel from './panels/SettingsOTADownloadingPanel';
import SettingsOTAInstallFailedPanel from './panels/SettingsOTAInstallFailedPanel';
import SettingsOTAInstallingPanel from './panels/SettingsOTAInstallingPanel';
import SettingsOTAInstallSucceededPanel from './panels/SettingsOTAInstallSucceededPanel';
import SettingsOTAReadyPanel from './panels/SettingsOTAReadyPanel';

class SettingsOTAPanel extends Component {

    render() {
        switch ( this.props.status ) {
            case OTAStatus.AVAILABLE:
                return <SettingsOTAAvailablePanel
                        deviceFirmwareVersion={this.props.deviceFirmwareVersion}
                        firmwareVersion={this.props.firmwareVersion}
                        download={this.props.firmwareVersion}
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
                        download={this.props.firmwareVersion}
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
        }
    }

}

export default SettingsOTAPanel;