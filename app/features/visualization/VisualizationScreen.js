import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import VisualizationView from './VisualizationView';
import * as Actions from './VisualizationActions';
import * as SettingsSelectors from 'app/redux/selectors/SettingsSelectors';

const mapStateToProps = (state) => {
    return {
        isShowing: SettingsSelectors.getIsShowingVisualization(state),
   };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        tappedClose: Actions.tappedClose,
    }, dispatch);
};

const VisualizationScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(VisualizationView);

export default VisualizationScreen;
