import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './EditHistoryFilterDeviceActions';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';
import EditFilterModal from 'app/shared_features/edit_filter/EditFilterModal';

const title = 'Choose Devices';
const text = '';
const stackValues = false;
const options = ['Kratos Flywheel', 'RepOne 3D Sensor'];

const mapStateToProps = state => {
    return {
        title,
        text,
        multipleInput: true,
        inputs: HistorySelectors.getEditingHistoryFilterDevices(state),
        options,
        isModalShowing:
            HistorySelectors.getIsEditingHistoryFilterDevices(state),
        stackValues,
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            saveSetMultipleInput: Actions.saveDevices,
            closeModal: Actions.dismissDevices,
            cancelModal: Actions.cancelDevices,
            tappedPill: Actions.tappedPill,
            addPill: Actions.addPill,
        },
        dispatch,
    );
};

const EditHistoryFilterDeviceScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditFilterModal);

export default EditHistoryFilterDeviceScreen;
