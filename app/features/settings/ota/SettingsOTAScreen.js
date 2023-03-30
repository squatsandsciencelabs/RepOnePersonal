import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsOTAPanel from './SettingsOTAPanel';
import * as Actions from './SettingsOTAActions';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import * as OTASelectors from 'app/redux/selectors/OTASelectors';

const mapStateToProps = state => {
    return {
        deviceFirmwareVersion:
            ConnectedDeviceStatusSelectors.getFirmwareVersion(state),
        connectedDevice:
            ConnectedDeviceStatusSelectors.getConnectedDeviceName(state),
        firmwareVersion: OTASelectors.getFirmwareVersion(state),
        firmwareDescription: OTASelectors.getFirmwareDescription(state),
        status: OTASelectors.getStatus(state),
        progress: OTASelectors.getProgressDividedBy100(state),
        connectedDeviceStatus:
            ConnectedDeviceStatusSelectors.getConnectedDeviceStatus(state),
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            download: Actions.download,
            cancelDownload: Actions.cancelDownload,
            deleteDownload: Actions.deleteDownload,
            retryInstall: Actions.retryInstall,
            cancelInstall: Actions.cancelInstall,
        },
        dispatch,
    );
};

const SettingsOTAScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsOTAPanel);

export default SettingsOTAScreen;
