import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SelectTagsModal from 'app/shared_features/tags/SelectTagsModal';
import * as Actions from './EditHistoryFilterDeviceActions';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import EditKratosDiscsModal from 'app/shared_features/edit_set/EditKratosDiscsModal';

const title = 'Choose Devices';
const placeholder = 'Enter Device Name';
const text = '';
const stackValues = false;

const mapStateToProps = state => {
    return {
        title,
        text,
        multipleInput: true,
        inputs: HistorySelectors.getEditingHistoryFilterDevices(state),
        options: [{ key: 'Kratos Flywheel' }, { key: 'RepOne 3D Sensor' }],
        isModalShowing:
            HistorySelectors.getIsEditingHistoryFilterDevices(state),
        stackValues,
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            saveSetMultipleInput: (id, devices) => Actions.saveDevices(devices),
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
)(EditKratosDiscsModal);

export default EditHistoryFilterDeviceScreen;
