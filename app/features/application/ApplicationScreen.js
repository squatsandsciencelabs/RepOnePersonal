import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { OTAStatus } from 'app/redux/reducers/OTAReducer';
import * as AppStateSelectors from 'app/redux/selectors/AppStateSelectors';
import * as OTASelectors from 'app/redux/selectors/OTASelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import { isVersionGreaterThan } from 'app/math/VersionComparison';

import * as Actions from './ApplicationActions';
import ApplicationView from './ApplicationView';

// TODO: consider memoizing this via reselect for speed purposes
const isUpgradeAvailable = (state) => {
    // check download available
    const status = OTASelectors.getStatus(state);
    if (status === OTAStatus.UPDATE_APP) {
        return true;
    }

    // check connected device firmware
    const deviceFirmware = ConnectedDeviceStatusSelectors.getFirmwareVersion(state);
    if (deviceFirmware === null) {
        return false;
    }

    // check available firmware
    const availableFirmware = OTASelectors.getFirmwareVersion(state);
    if (availableFirmware === '0.0.1') {
        return false;
    }

    // compare
    return isVersionGreaterThan(availableFirmware, deviceFirmware);
};

const mapStateToProps = (state) => ({
    tabIndex: AppStateSelectors.getTabIndex(state),
    killSwitch: state.killSwitch,
    isUpgradeAvailable: isUpgradeAvailable(state),
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        changeTab: Actions.changeTab,
        load: Actions.load
    }, dispatch);
};

const ApplicationScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(ApplicationView);

export default ApplicationScreen;
