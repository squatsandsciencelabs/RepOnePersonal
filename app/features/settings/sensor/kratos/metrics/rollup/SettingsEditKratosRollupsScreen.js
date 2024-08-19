import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';

import {
    EMPTY_QUANTIFIER,
    FIRST_REP_QUANTIFIER,
    LAST_REP_QUANTIFIER,
    MIN_QUANTIFIER,
    MAX_QUANTIFIER,
    AVG_QUANTIFIER,
    ABS_LOSS_QUANTIFIER,
    PERCENT_LOSS_QUANTIFIER,
    MAX_EVER_QUANTIFIER,
    MIN_EVER_QUANTIFIER,
    SET_LOSS_QUANTIFIER,
    PEAK_END_QUANTIFIER,
} from 'app/configs+constants/CollapsedMetricTypes';
import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsEditKratosRollupsActions';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = rollup => ({
    label: CollapsedMetricsUtility.quantifierString(rollup),
    value: rollup,
});

const getItems = () => [
    pickerItem(EMPTY_QUANTIFIER),
    pickerItem(AVG_QUANTIFIER),
    pickerItem(MAX_EVER_QUANTIFIER),
    pickerItem(MIN_EVER_QUANTIFIER),
    pickerItem(ABS_LOSS_QUANTIFIER),
    pickerItem(PERCENT_LOSS_QUANTIFIER),
    pickerItem(SET_LOSS_QUANTIFIER),
    pickerItem(PEAK_END_QUANTIFIER),
    pickerItem(FIRST_REP_QUANTIFIER),
    pickerItem(LAST_REP_QUANTIFIER),
    pickerItem(MIN_QUANTIFIER),
    pickerItem(MAX_QUANTIFIER),
];

const mapStateToPropsiOS = state => {
    const isModalShowing =
        KratosCollapsedSettingsSetMetricsSelectors.getIsEditingRollup(state);
    const selectedValue =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosRollup(
            state,
        );

    return {
        isModalShowing,
        items: getItems(),
        selectedValue,
    };
};

const mapStateToPropsAndroid = (state, ownProps) => {
    const selectedValue =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosRollupByRank(
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
    Platform.OS === 'ios' ? mapStateToPropsiOS : mapStateToPropsAndroid;

const mapDispatchToProps = (dispatch, ownProps) => {
    if (Platform.OS === 'ios') {
        return bindActionCreators(
            {
                selectValue: Actions.saveRollupSetting,
                closeModal: Actions.dismissRollupSetter,
            },
            dispatch,
        );
    } else {
        return bindActionCreators(
            {
                selectValue: value =>
                    Actions.saveRollupSettingAndroid(value, ownProps.rank),
            },
            dispatch,
        );
    }
};

const SettingsEditKratosRollupsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsEditKratosRollupsScreen;
