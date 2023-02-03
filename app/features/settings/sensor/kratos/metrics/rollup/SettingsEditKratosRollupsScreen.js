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

const items = [
    pickerItem(EMPTY_QUANTIFIER),
    pickerItem(AVG_QUANTIFIER), // vel, pkv, dur
    pickerItem(MAX_EVER_QUANTIFIER), // vel, pkv, dur
    pickerItem(MIN_EVER_QUANTIFIER), // vel, pkv, dur
    pickerItem(ABS_LOSS_QUANTIFIER), // vel, pkv, dur, rom
    pickerItem(PERCENT_LOSS_QUANTIFIER), // vel, pkv, dur, rom
    pickerItem(SET_LOSS_QUANTIFIER), // vel, pkv, dur, rom
    pickerItem(PEAK_END_QUANTIFIER), // vel, pkv, dur, rom
    pickerItem(FIRST_REP_QUANTIFIER), // all
    pickerItem(LAST_REP_QUANTIFIER), // all
    pickerItem(MIN_QUANTIFIER), // all
    pickerItem(MAX_QUANTIFIER), // all
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
        items,
        selectedValue,
    };
};

// not sure if memoization is worth it
// memoizing would require ref checks of 6 items
// not memoizing just checks rank up to 6 times, so it can end FASTER, though it does need to generate the final return value
const mapStateToPropsAndroid = (state, ownProps) => {
    switch (ownProps.rank) {
        case 1:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup1(
                        state,
                    ),
            };
        case 2:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup2(
                        state,
                    ),
            };
        case 3:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup3(
                        state,
                    ),
            };
        case 4:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup4(
                        state,
                    ),
            };
        case 5:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup5(
                        state,
                    ),
            };
        default:
            return {};
    }
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
        switch (ownProps.rank) {
            case 1:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveRollup1Setting,
                    },
                    dispatch,
                );
            case 2:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveRollup2Setting,
                    },
                    dispatch,
                );
            case 3:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveRollup3Setting,
                    },
                    dispatch,
                );
            case 4:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveRollup4Setting,
                    },
                    dispatch,
                );
            case 5:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveRollup5Setting,
                    },
                    dispatch,
                );
            default:
                return {};
        }
    }
};

const SettingsEditKratosRollupsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsEditKratosRollupsScreen;
