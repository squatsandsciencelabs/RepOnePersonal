import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import SettingsCalibrationPanel from './SettingsCalibrationPanel';
import * as Actions from './SettingsCalibrationActions';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';

// debatable if this should be memoized, but might be worth it given it's called every time and RARELY changes
const selectMapStateToProps = createSelector(
    ConnectedDeviceStatusSelectors.getAPIFormatVersion,
    format => {
        return {
            isVisible: format !== null && format >= 2,
        };
    },
);

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            tappedCalibrate: Actions.tappedCalibrate,
            tappedReset: Actions.tappedReset,
        },
        dispatch,
    );
};

const SettingsCalibrationScreen = connect(
    selectMapStateToProps,
    mapDispatchToProps,
)(SettingsCalibrationPanel);

export default SettingsCalibrationScreen;
