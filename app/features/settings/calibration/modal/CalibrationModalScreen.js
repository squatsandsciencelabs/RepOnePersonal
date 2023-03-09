import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CalibrationSelectors from 'app/redux/selectors/CalibrationSelectors';
import * as Actions from './CalibrationModalActions';
import CalibrationModalView from './CalibrationModalView';

const mapStateToProps = state => ({
    isModalShowing: CalibrationSelectors.getIsModalShowing(state),
    step: CalibrationSelectors.getStep(state),
    isCancelEnabled: CalibrationSelectors.getIsCancelEnabled(state),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            cancelCalibration: Actions.cancelCalibration,
            startCalibration: Actions.startCalibration,
            finishCalibration: Actions.finishCalibration,
        },
        dispatch,
    );
};

const CalibrationModalScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(CalibrationModalView);

export default CalibrationModalScreen;
