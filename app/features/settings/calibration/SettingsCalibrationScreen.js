import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsCalibrationPanel from './SettingsCalibrationPanel';
import * as Actions from './SettingsCalibrationActions';

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
