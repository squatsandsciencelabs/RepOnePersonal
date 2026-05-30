import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import VideoButton from 'app/shared_features/set_card/expanded/VideoButton';
import * as Actions from './OneRMEditSetFormActions';
import * as AnalysisSelectors from 'app/redux/selectors/AnalysisSelectors';

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            tappedRecord: Actions.presentRecordVideo,
            tappedCommentary: Actions.presentRecordCommentary,
            tappedWatch: Actions.presentWatchVideo,
        },
        dispatch,
    );
};

const mapStateToProps = (state, ownProps) => ({
    isPickingVideo:
        AnalysisSelectors.getPickingVideoSetID(state) === ownProps.setID,
});

const OneRMEditSetVideoButtonScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(VideoButton);

export default OneRMEditSetVideoButtonScreen;
