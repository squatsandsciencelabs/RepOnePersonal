import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsCalibrationPanel from './SettingsCalibrationPanel';
import * as Actions from './SettingsCalibrationActions';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';

const mapStateToProps = (state) => {
    const format = ConnectedDeviceStatusSelectors.getAPIFormatVersion(state);
    return {
        isVisible: format !== null && format >= 1, // NOTE: set this to api format 2 later, using 1 for testing purposes
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        tappedCalibrate: Actions.tappedCalibrate,
    }, dispatch);
};

const SettingsCalibrationScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsCalibrationPanel);

export default SettingsCalibrationScreen;
