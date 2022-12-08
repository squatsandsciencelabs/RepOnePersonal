import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import VideoButton from 'app/shared_features/set_card/expanded/VideoButton';
import * as Actions from './EditWorkoutSetFormActions';
import * as WorkoutSelectors from 'app/redux/selectors/WorkoutSelectors';

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        tappedRecord: Actions.presentRecordVideo,
        tappedCommentary: Actions.presentRecordCommentary,
        tappedWatch: Actions.presentWatchVideo
    }, dispatch);
};

const mapStateToProps = (state) => ({
    isSaving: WorkoutSelectors.getIsSavingVideo(state),
});

const WorkoutVideoButtonScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(VideoButton);

export default WorkoutVideoButtonScreen;
