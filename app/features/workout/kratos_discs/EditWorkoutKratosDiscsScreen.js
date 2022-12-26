import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditTextModal from 'app/shared_features/edit_set/EditTextModal';
import * as SuggestionsSelectors from 'app/redux/selectors/SuggestionsSelectors';
// import * as Actions from './EditWorkoutKratosDiscsScreen';

const title = 'Choose Flywheels';
const placeholder = 'Add Flywheel';
const text = '';

const mapStateToProps = (state) => ({
    title,
    placeholder,
    text,
    multipleInput: true,
    setID: state.workout.editingKratosDiscsSetID,
    inputs: state.workout.editingKratosDiscs,
    generateMultipleInputSuggestions: (input, ignore) => {
        return SuggestionsSelectors.generateKratosDiscs(state, input, ignore);
    },
    isModalShowing: state.workout.editingKratosDiscsSetID !== null
});

const EditWorkoutKratosDiscsScreen = connect(
    mapStateToProps,
    null,
    // mapDispatchToProps
)(EditTextModal);

export default EditWorkoutKratosDiscsScreen;
