import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import SetForm from 'app/shared_features/set_card/expanded/SetForm';
import * as Actions from './EditHistorySetFormActions';
import * as DateUtils from 'app/utility/DateUtils';

const makeSelector = () => createSelector(
    (state, props) => props.initialStartTime,
    initialStartTime => {
        return {
            rpeDisabled: !DateUtils.checkDateWithinRange(7, initialStartTime),
        };
    }
);

const makeMapStateToProps = () => {
    const getModel = makeSelector();
    return (state, props) => {
        return getModel(state, props);
    };
};


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        saveSet: Actions.saveSet,
        tapExercise: Actions.presentExercise,
        tapTags: Actions.presentTags,
        tapRPE: Actions.editRPE,
        tapWeight: Actions.editWeight,
        dismissRPE: Actions.dismissRPE,
        dismissWeight: Actions.dismissWeight,
        toggleMetric: Actions.toggleMetric,
        tapKratosDiscs: Actions.presentKratosDiscs,
    }, dispatch);
};

const EditHistorySetFormScreen = connect(
    makeMapStateToProps,
    mapDispatchToProps
)(SetForm);

export default EditHistorySetFormScreen;
