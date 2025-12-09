import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditTextModal from 'app/shared_features/edit_set/EditTextModal';
import * as WorkoutSelectors from 'app/redux/selectors/WorkoutSelectors';
import * as SuggestionsSelectors from 'app/redux/selectors/SuggestionsSelectors';
import * as Actions from './EditWorkoutExerciseActions';
import Localized from 'app/services/Localization';

const title = Localized('EDIT_EXERCISE');
const placeholder = Localized('ENTER_EXERCISE');

const mapStateToProps = state => ({
    title,
    placeholder,
    text: WorkoutSelectors.getEditingExerciseName(state),
    setID: WorkoutSelectors.getEditingExerciseSetID(state),
    bias: WorkoutSelectors.getEditingExerciseBias(state),
    generateSingleInputSuggestions: (input, bias) => {
        return SuggestionsSelectors.generateExerciseNameSuggestions(
            state,
            input,
            bias,
        );
    },
    isModalShowing: state.workout.editingExerciseSetID !== null,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            saveSetSingleInput: Actions.saveExerciseName,
            closeModal: Actions.dismissExercise,
            cancelModal: Actions.cancelExercise,
        },
        dispatch,
    );
};

const EditWorkoutExerciseScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditTextModal);

export default EditWorkoutExerciseScreen;
