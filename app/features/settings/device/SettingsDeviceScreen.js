import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsDevicePanel from './SettingsDevicePanel';
import * as Actions from './SettingsDeviceActions';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as OTASelectors from 'app/redux/selectors/OTASelectors';

const mapStateToProps = state => {
    return {
        deviceStatus:
            ConnectedDeviceStatusSelectors.getConnectedDeviceStatus(state),
        deviceName:
            ConnectedDeviceStatusSelectors.getConnectedDeviceName(state),
        scannedDevices: state.scannedDevices,
        isInstalling: OTASelectors.getIsInstalling(state),
        deviceBatteryPercentage:
            ConnectedDeviceStatusSelectors.getConnectedDeviceBatteryPercentage(
                state,
            ),
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            startDeviceScan: Actions.startDeviceScan,
            stopDeviceScan: Actions.stopDeviceScan,
            connectDevice: Actions.connectDevice,
            disconnectDevice: Actions.disconnectDevice,
            stopReconnect: Actions.stopReconnect,
            tappedTroubleshooting: Actions.presentTroubleshootingTips,
        },
        dispatch,
    );
};

const SettingsDeviceScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsDevicePanel);

export default SettingsDeviceScreen;
