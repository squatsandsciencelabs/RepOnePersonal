import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import VisualizationView from './VisualizationView';
import * as VisualizationSelectors from 'app/redux/selectors/VisualizationSelectors';

const mapStateToProps = state => {
    return {
        isShowing: VisualizationSelectors.getIsShowingVisualization(state),
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

const VisualizationScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(VisualizationView);

export default VisualizationScreen;
