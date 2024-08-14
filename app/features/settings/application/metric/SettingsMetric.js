import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsMetricActions';

import * as SettingsSelectors from 'app/redux/selectors/SettingsSelectors';
import Localized from 'app/services/Localization';

const items = [
    { label: Localized('DISPLAY_METRIC.kgs'), value: 'kgs' },
    { label: Localized('DISPLAY_METRIC.lbs'), value: 'lbs' },
];

const mapStateToProps = state => ({
    isModalShowing: SettingsSelectors.getIsEditingDefaultMetric(state),
    items,
    selectedValue: SettingsSelectors.getDefaultMetric(state),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            selectValue: Actions.saveDefaultMetricSetting,
            closeModal: Actions.dismissDefaultMetricSetter,
        },
        dispatch,
    );
};

const SettingsMetric = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsMetric;
