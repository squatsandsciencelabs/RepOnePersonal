import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditKratosDiscsModal from 'app/shared_features/edit_set/EditKratosDiscsModal';
import * as Actions from './EditWorkoutKratosDiscsActions';
import { kratosDiscsOptions } from 'app/configs+constants/KratosConfig';

const title = 'Choose Flywheels';
const stackValues = true;
const noTextTransform = true;
const text = '';

const mapKratosDiscToArray = kratosDiscs => {
    return Object.keys(kratosDiscs)
        .filter(key => !!kratosDiscs[key])
        .map(key => {
            return { [key]: kratosDiscs[key] };
        });
};

const mapStateToProps = state => ({
    title,
    text,
    multipleInput: true,
    setID: state.workout.editingKratosDiscsSetID,
    stackedInputs: mapKratosDiscToArray(state.workout.editingKratosDiscs),
    options: kratosDiscsOptions,
    isModalShowing: state.workout.editingKratosDiscsSetID !== null,
    stackValues,
    noTextTransform,
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
)(EditKratosDiscsModal);

export default EditWorkoutKratosDiscsScreen;
