import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsKratosAutoDeleteRepsPanel from './SettingsKratosAutoDeleteRepsPanel';
import * as Actions from './SettingsKratosAutoDeleteRepsActions';
import * as SettingsSelectors from 'app/redux/selectors/SettingsSelectors';

const mapStateToProps = state => ({
    kratosAutoDeleteReps: SettingsSelectors.getKratosAutoDeleteRepCount(state),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            tapKratosAutoDeleteReps: Actions.presentKratosAutoDeleteReps,
        },
        dispatch,
    );
};

const SettingsKratosAutoDeleteRepsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsKratosAutoDeleteRepsPanel);

export default SettingsKratosAutoDeleteRepsScreen;
