import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditTextModal from 'app/shared_features/edit_set/EditTextModal';
import * as SuggestionsSelectors from 'app/redux/selectors/SuggestionsSelectors';
import * as Actions from './EditHistoryTagsActions';

const title = 'Edit Tags';
const placeholder = 'Enter Tag';
const text = '';

const mapStateToProps = state => ({
    title,
    placeholder,
    text,
    multipleInput: true,
    setID: state.history.editingTagsSetID,
    inputs: state.history.editingTags,
    generateMultipleInputSuggestions: (input, ignore) =>
        SuggestionsSelectors.generateTagsSuggestions(state, input, ignore),
    isModalShowing: state.history.editingTagsSetID !== null,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            saveSetMultipleInput: Actions.saveTags,
            closeModal: Actions.dismissTags,
            cancelModal: Actions.cancelTags,
            tappedPill: Actions.tappedPill,
            addPill: Actions.addPill,
        },
        dispatch,
    );
};

const EditHistoryTagsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditTextModal);

export default EditHistoryTagsScreen;
