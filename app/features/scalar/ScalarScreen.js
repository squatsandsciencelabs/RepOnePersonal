import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ScalarView from './ScalarView';
import * as Actions from './ScalarActions';
import * as ScalarSelectors from 'app/redux/selectors/ScalarSelectors';

const mapStateToProps = (state) => {
    return {
        start: ScalarSelectors.getStartPoints(state),
        end: ScalarSelectors.getEndPoints(state),
        results: ScalarSelectors.getResults(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        tappedLogStart: Actions.tappedLogStart,
        tappedLogEnd: Actions.tappedLogEnd,
        tappedAddToRep: Actions.tappedAddToRep,
    }, dispatch);
};

const ScalarScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScalarView);

export default ScalarScreen;
