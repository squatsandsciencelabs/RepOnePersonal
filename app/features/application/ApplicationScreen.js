import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { OTAStatus } from 'app/redux/reducers/OTAReducer';
import * as AppStateSelectors from 'app/redux/selectors/AppStateSelectors';
import * as OTASelectors from 'app/redux/selectors/OTASelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import { isVersionGreaterThan } from 'app/math/VersionComparison';

import * as Actions from './ApplicationActions';
import ApplicationView from './ApplicationView';

const defaultFirmware = '0.0.1';

const isUpgradeAvailable = createSelector(
    OTASelectors.getStatus,
    ConnectedDeviceStatusSelectors.getFirmwareVersion,
    OTASelectors.getFirmwareVersion,
    (status, deviceFirmware, availableFirmware) => {
        if (status === OTAStatus.UPDATE_APP) {
            return true;
        }
        if (deviceFirmware === null) {
            return false;
        }
        if (availableFirmware === defaultFirmware) {
            return false;
        }
        return isVersionGreaterThan(availableFirmware, deviceFirmware);
    },
);

const mapStateToProps = state => ({
    tabIndex: AppStateSelectors.getTabIndex(state),
    killSwitch: state.killSwitch,
    isUpgradeAvailable: isUpgradeAvailable(state),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            changeTab: Actions.changeTab,
            load: Actions.load,
        },
        dispatch,
    );
};

const ApplicationScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ApplicationView);

export default ApplicationScreen;
