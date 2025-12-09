import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';

import {
    CONCENTRIC,
    ECCENTRIC,
} from 'app/configs+constants/CollapsedMetricTypes';
import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsEditKratosPhasesActions';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = phase => ({
    label: CollapsedMetricsUtility.getPhaseString(phase),
    value: phase,
});

const getItems = () => [pickerItem(CONCENTRIC), pickerItem(ECCENTRIC)];

const mapStateToPropsIOS = state => {
    const isModalShowing =
        KratosCollapsedSettingsSetMetricsSelectors.getIsEditingPhase(state);

    const selectedValue =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosPhase(state);

    return {
        isModalShowing,
        items: getItems(),
        selectedValue,
    };
};

const mapStateToPropsAndroid = (state, ownProps) => {
    const selectedValue =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosPhaseByRank(
            state,
            ownProps.rank,
        );

    return {
        items: getItems(),
        selectedValue,
    };
};

// this way only check OS once
const mapStateToProps =
    Platform.OS === 'ios' ? mapStateToPropsIOS : mapStateToPropsAndroid;

const mapDispatchToProps = (dispatch, ownProps) => {
    if (Platform.OS === 'ios') {
        return bindActionCreators(
            {
                selectValue: Actions.savePhaseSetting,
                closeModal: Actions.dismissPhaseSetter,
            },
            dispatch,
        );
    } else {
        return bindActionCreators(
            {
                selectValue: value =>
                    Actions.savePhaseSettingAndroid(value, ownProps.rank),
            },
            dispatch,
        );
    }
};

const SettingsEditKratosPhasesScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsEditKratosPhasesScreen;
