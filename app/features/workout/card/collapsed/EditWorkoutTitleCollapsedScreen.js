import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SetTitleRowCollapsed from 'app/shared_features/set_card/collapsed/SetTitleRowCollapsed';
import * as Actions from './EditWorkoutTitleCollapsedActions';
import * as WorkoutSelectors from 'app/redux/selectors/WorkoutSelectors';

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        saveSet: Actions.saveSet,
        tappedExpand: Actions.expandCard,
        tappedWatch: Actions.presentWatchVideo,
    }, dispatch);
};

const mapStateToProps = (state) => ({
    isSavingVideo: WorkoutSelectors.getIsSavingVideo(state),
});

const EditWorkoutTitleExpandedScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SetTitleRowCollapsed);

export default EditWorkoutTitleExpandedScreen;
