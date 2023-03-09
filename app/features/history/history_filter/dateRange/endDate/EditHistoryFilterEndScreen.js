import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import DatePicker from 'app/shared_features/date_picker/DatePicker';

import * as Actions from './EditHistoryFilterEndDateActions';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';
import * as DateUtils from 'app/utility/DateUtils';

const selectMapStateToProps = createSelector(
    HistorySelectors.getEditingHistoryFilterEndingDate,
    HistorySelectors.getIsEditingHistoryFilterEndingDate,
    (editingFilterEndDate, isVisible) => {
        let date = DateUtils.getDate(editingFilterEndDate);
        if (!date) {
            date = new Date();
        }

        return {
            date,
            isVisible,
        };
    },
);

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            changeDate: Actions.changeDate,
            closePicker: Actions.dismissPicker,
        },
        dispatch,
    );
};

const EditHistoryFilterEndDateScreen = connect(
    selectMapStateToProps,
    mapDispatchToProps,
)(DatePicker);

export default EditHistoryFilterEndDateScreen;
