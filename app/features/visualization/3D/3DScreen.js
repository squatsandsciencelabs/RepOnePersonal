import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from './3DActions';
import View from './3DView';

const mapStateToProps = (state) => {
    return {
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
