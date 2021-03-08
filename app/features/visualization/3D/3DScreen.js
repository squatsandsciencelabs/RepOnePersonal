import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from './3DActions';
import View from './3DView';
import * as VisualizationSelectors from 'app/redux/selectors/VisualizationSelectors';

const mapStateToProps = state => {
    return {
        // metadata
        model: VisualizationSelectors.getRepModel(state),

        // navigation
        navigationText: VisualizationSelectors.getRepNavigationText(state),
        repIndex: VisualizationSelectors.getSelectedRepIndex(state),
        prevRepIndex: VisualizationSelectors.getPrevRepIndex(state),
        nextRepIndex: VisualizationSelectors.getNextRepIndex(state),

        // rendering
        colors: VisualizationSelectors.getColors(state),
        data: VisualizationSelectors.getData(state),
        vertices: VisualizationSelectors.getVertices(state),
        numPoints: VisualizationSelectors.getNumPoints(state),
        midpointIndex: VisualizationSelectors.getMidpointIndex(state),
   };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        navigateToRep: Actions.navigateToRep,
        tappedClose: Actions.tappedClose,
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(View);
