import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsCalibrationPanel from './SettingsCalibrationPanel';
import * as Actions from './SettingsCalibrationActions';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';

const mapStateToProps = (state) => {
    const format = ConnectedDeviceStatusSelectors.getAPIFormatVersion(state);
    return {
        isVisible: format !== null && format >= 2, // NOTE: can theoretically also allow api format 1
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        tappedCalibrate: Actions.tappedCalibrate,
    }, dispatch);
};

const SettingsCalibrationScreen = connect(
    null,
    mapDispatchToProps
)(SettingsCalibrationPanel);

export default SettingsCalibrationScreen;
