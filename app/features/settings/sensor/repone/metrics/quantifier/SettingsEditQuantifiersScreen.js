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
import * as Actions from './SettingsEditQuantifiersActions';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/CollapsedSettingsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = quantifier => ({
    label: CollapsedMetricsUtility.quantifierString(quantifier),
    value: quantifier,
});

const items = [
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
    return {
        isModalShowing:
            CollapsedSettingsSelectors.getIsEditingQuantifier(state),
        items,
        selectedValue: CollapsedSettingsSelectors.getCurrentQuantifier(state),
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
                selectedValue: CollapsedSettingsSelectors.getQuantifier1(state),
            };
        case 2:
            return {
                items,
                selectedValue: CollapsedSettingsSelectors.getQuantifier2(state),
            };
        case 3:
            return {
                items,
                selectedValue: CollapsedSettingsSelectors.getQuantifier3(state),
            };
        case 4:
            return {
                items,
                selectedValue: CollapsedSettingsSelectors.getQuantifier4(state),
            };
        case 5:
            return {
                items,
                selectedValue: CollapsedSettingsSelectors.getQuantifier5(state),
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
                selectValue: Actions.saveQuantifierSetting,
                closeModal: Actions.dismissQuantifierSetter,
            },
            dispatch,
        );
    } else {
        switch (ownProps.rank) {
            case 1:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveQuantifier1Setting,
                    },
                    dispatch,
                );
            case 2:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveQuantifier2Setting,
                    },
                    dispatch,
                );
            case 3:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveQuantifier3Setting,
                    },
                    dispatch,
                );
            case 4:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveQuantifier4Setting,
                    },
                    dispatch,
                );
            case 5:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveQuantifier5Setting,
                    },
                    dispatch,
                );
            default:
                return {};
        }
    }
};

const SettingsEditQuantifiersScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsEditQuantifiersScreen;
