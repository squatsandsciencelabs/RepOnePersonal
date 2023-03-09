import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SelectTagsModal from 'app/shared_features/tags/SelectTagsModal';
import * as Actions from './EditHistoryFilterTagsToIncludeActions';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

const title = 'Tags to Include';
const placeholder = 'Enter Tag';
const text = '';

const mapStateToProps = state => {
    // TODO move tags suggestion out
    return {
        title,
        placeholder,
        text,
        inputs: HistorySelectors.getEditingFilterTagsToInclude(state),
        generateSuggestions: (input, ignore) =>
            SetsSelectors.getHistoryFilterTagsToIncludeSuggestions(
                state,
                input,
                ignore,
            ),
        isModalShowing:
            HistorySelectors.getIsEditingHistoryFilterTagsToInclude(state),
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            save: Actions.saveTags,
            closeModal: Actions.dismissTags,
            cancelModal: Actions.cancelTags,
            tappedPill: Actions.tappedPill,
            addPill: Actions.addPill,
        },
        dispatch,
    );
};

const EditHistoryFilterTagsToIncludeScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SelectTagsModal);

export default EditHistoryFilterTagsToIncludeScreen;
