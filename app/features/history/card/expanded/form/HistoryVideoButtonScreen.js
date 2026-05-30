import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import VideoButton from 'app/shared_features/set_card/expanded/VideoButton';
import * as Actions from './EditHistorySetFormActions';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';

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
    isSaving: HistorySelectors.getIsSavingVideo(state),
    isPickingVideo:
        HistorySelectors.getPickingVideoSetID(state) === ownProps.setID,
});

const HistoryVideoButtonScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(VideoButton);

export default HistoryVideoButtonScreen;
