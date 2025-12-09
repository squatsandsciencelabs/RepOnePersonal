import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditTextModal from 'app/shared_features/edit_set/EditTextModal';
import * as SuggestionsSelectors from 'app/redux/selectors/SuggestionsSelectors';
import * as Actions from './EditHistoryExerciseActions';
import Localized from 'app/services/Localization';

const title = Localized('EDIT_EXERCISE');
const placeholder = Localized('ENTER_EXERCISE');

const mapStateToProps = state => ({
    title,
    placeholder,
    text: state.history.editingExerciseName,
    setID: state.history.editingExerciseSetID,
    generateSingleInputSuggestions: input => {
        return SuggestionsSelectors.generateExerciseNameSuggestions(
            state,
            input,
        );
    },
    isModalShowing: state.history.editingExerciseSetID !== null,
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

const EditHistoryExerciseScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditTextModal);

export default EditHistoryExerciseScreen;
