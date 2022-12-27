import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditTextModal from 'app/shared_features/edit_set/EditTextModal';
import * as SuggestionsSelectors from 'app/redux/selectors/SuggestionsSelectors';
import * as Actions from './EditWorkoutKratosDiscsActions';

const title = 'Choose Flywheels';
const stackValues = true;
const noTextTransform = true;
const noTextField = true;
const text = '';

const mapStateToProps = state => ({
    title,
    text,
    multipleInput: true,
    setID: state.workout.editingKratosDiscsSetID,
    inputs: state.workout.editingKratosDiscs,
    generateMultipleInputSuggestions: (input, ignore) => {
        return SuggestionsSelectors.generateKratosDiscsSuggestions(
            state,
            input,
            ignore,
        );
    },
    isModalShowing: state.workout.editingKratosDiscsSetID !== null,
    stackValues,
    noTextTransform,
    noTextField,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            saveSetMultipleInput: Actions.saveKratosDiscs,
            closeModal: Actions.dismissKratosDiscs,
            cancelModal: Actions.cancelKratosDiscs,
            tappedPill: Actions.tappedPill,
            addPill: Actions.addPill,
        },
        dispatch,
    );
};

const EditWorkoutKratosDiscsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditTextModal);

export default EditWorkoutKratosDiscsScreen;
