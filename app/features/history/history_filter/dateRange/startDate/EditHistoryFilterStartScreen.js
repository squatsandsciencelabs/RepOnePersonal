import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import DatePicker from 'app/shared_features/date_picker/DatePicker';

import * as Actions from './EditHistoryFilterStartDateActions';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';
import * as DateUtils from 'app/utility/DateUtils';

const selectMapStateToProps = createSelector(
    HistorySelectors.getEditingHistoryFilterStartingDate,
    HistorySelectors.getIsEditingHistoryFilterStartingDate,
    (editingFilterStartDate, isVisible) => {
        let date = DateUtils.getDate(editingFilterStartDate);
        if (!date) {
            date = new Date();
        }
        
        return {
            date,
            isVisible,
        };
    }
);

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        changeDate: Actions.changeDate,
        closePicker: Actions.dismissPicker,
    }, dispatch);
};

const EditHistoryFilterStartDateScreen = connect(
    selectMapStateToProps,
    mapDispatchToProps
)(DatePicker);

export default EditHistoryFilterStartDateScreen;
