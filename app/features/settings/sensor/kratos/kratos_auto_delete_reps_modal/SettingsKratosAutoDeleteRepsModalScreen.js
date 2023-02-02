import * as SettingsSelectors from 'app/redux/selectors/SettingsSelectors';
import { bindActionCreators } from 'redux';
import * as Actions from 'app/features/settings/sensor/kratos/kratos_auto_delete_reps_modal/SettingsKratosAutoDeleteRepsModalActions';
import { connect } from 'react-redux';
import PickerModal from 'app/shared_features/picker/PickerModal';

const MIN_AUTO_DELETE_REPS = 0;
const MAX_AUTO_DELETE_REPS = 5;

const buildKratosAutoDeleteItemsFromRange = (min = 0, max = 5) => {
    const items = [];

    for (let i = min; i <= max; i++) {
        items.push({
            label: `${i} reps`,
            value: i,
        });
    }

    return items;
};

const mapStateToProps = state => ({
    isModalShowing: SettingsSelectors.getIsEditingKratosAutoDeleteReps(state),
    items: buildKratosAutoDeleteItemsFromRange(
        MIN_AUTO_DELETE_REPS,
        MAX_AUTO_DELETE_REPS,
    ),
    selectedValue: SettingsSelectors.getKratosAutoDeleteRepCount(state),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            selectValue: Actions.saveKratosAutoDeleteRepsSetting,
            closeModal: Actions.dismissKratosAutoDeleteRepsSetter,
        },
        dispatch,
    );
};

const SettingsKratosAutoDeleteRepsModalScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsKratosAutoDeleteRepsModalScreen;
