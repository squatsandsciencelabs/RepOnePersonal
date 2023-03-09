import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsFeedbackPanel from './SettingsFeedbackPanel';
import * as Actions from './SettingsFeedbackActions';

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            tappedFeedback: Actions.presentFeedback,
            showVisualization: Actions.showVisualization, // TODO: remove this test code
        },
        dispatch,
    );
};

const SettingsFeedbackScreen = connect(
    null,
    mapDispatchToProps,
)(SettingsFeedbackPanel);

export default SettingsFeedbackScreen;
