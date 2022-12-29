import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditModal from 'app/shared_features/edit_set/EditModal';
import * as SuggestionsSelectors from 'app/redux/selectors/SuggestionsSelectors';
import * as Actions from './EditWorkoutKratosDiscsActions';
import {
    KratosDiscFullNames,
    KratosDiscSizes,
} from 'app/configs+constants/KratosConfig';

const title = 'Choose Flywheels';
const stackValues = true;
const noTextTransform = true;
const text = '';

const getKratosDiscFullName = acronym => {
    return KratosDiscFullNames[acronym];
};

const getKratosDiscOrder = acronym => {
    return KratosDiscSizes[acronym];
};

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
    options: SuggestionsSelectors.generateKratosDiscsSuggestions(state, '', []),
    isModalShowing: state.workout.editingKratosDiscsSetID !== null,
    nameTransform: getKratosDiscFullName,
    getComparatorValue: getKratosDiscOrder,
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
)(EditModal);

export default EditWorkoutKratosDiscsScreen;
