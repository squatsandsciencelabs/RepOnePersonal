import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from './3DActions';
import View from './3DView';
import * as VisualizationSelectors from 'app/redux/selectors/VisualizationSelectors';

const mapStateToProps = state => {
    return {
        model: VisualizationSelectors.getRepModel(state),
        data: VisualizationSelectors.getBulkData(state),
   };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        tappedClose: Actions.tappedClose,
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(View);
