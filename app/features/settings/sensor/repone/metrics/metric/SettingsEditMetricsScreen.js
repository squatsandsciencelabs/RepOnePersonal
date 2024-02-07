import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { createSelector } from 'reselect';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import {
    EMPTY_METRIC,
    AVG_VELOCITY_METRIC,
    RPE_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKH_METRIC,
    PKV_METRIC,
    PEAK_FORCE_METRIC,
    PEAK_FORCE_HEIGHT_METRIC,
    PEAK_POWER_METRIC,
    PEAK_POWER_HEIGHT_METRIC,
    MEAN_FORCE_METRIC,
    MEAN_POWER_METRIC,
    LINEAR_3D_AVG_VELOCITY_METRIC,
    LINEAR_3D_ROM_METRIC,
    AVG_QUANTIFIER,
    MAX_EVER_QUANTIFIER,
    MIN_EVER_QUANTIFIER,
    ABS_LOSS_QUANTIFIER,
    PERCENT_LOSS_QUANTIFIER,
    SET_LOSS_QUANTIFIER,
    PEAK_END_QUANTIFIER,
    WORK_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';

import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsEditMetricsActions';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/CollapsedSettingsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = metric => ({
    label:
        Platform.OS === 'ios'
            ? CollapsedMetricsUtility.metricString(metric)
            : CollapsedMetricsUtility.metricAbbreviation(metric),
    value: metric,
});

const generateItems = quantifier => {
    switch (quantifier) {
        case MAX_EVER_QUANTIFIER:
        case MIN_EVER_QUANTIFIER:
            return OpenBarbellConfig.bulkMetricsEnabled
                ? [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(LINEAR_3D_AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
                  ]
                : [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
                  ];
        case SET_LOSS_QUANTIFIER:
        case PEAK_END_QUANTIFIER:
            return OpenBarbellConfig.bulkMetricsEnabled
                ? [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(LINEAR_3D_AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(PEAK_FORCE_METRIC),
                      pickerItem(PEAK_POWER_METRIC),
                      pickerItem(WORK_METRIC),
                      pickerItem(ROM_METRIC),
                      pickerItem(LINEAR_3D_ROM_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
                  ]
                : [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(ROM_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
                  ];
        default:
            return OpenBarbellConfig.bulkMetricsEnabled
                ? [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(LINEAR_3D_AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(PEAK_FORCE_METRIC),
                      pickerItem(PEAK_POWER_METRIC),
                      pickerItem(MEAN_FORCE_METRIC),
                      pickerItem(MEAN_POWER_METRIC),
                      pickerItem(WORK_METRIC),
                      pickerItem(ROM_METRIC),
                      pickerItem(LINEAR_3D_ROM_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
                      pickerItem(PKH_METRIC),
                      pickerItem(PEAK_FORCE_HEIGHT_METRIC),
                      pickerItem(PEAK_POWER_HEIGHT_METRIC),
                  ]
                : [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(PKH_METRIC),
                      pickerItem(ROM_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
                  ];
    }
};

const getiOSItems = createSelector(
    CollapsedSettingsSelectors.getCurrentQuantifier,
    quantifier => {
        return generateItems(quantifier);
    },
);

const mapStateToPropsiOS = state => {
    return {
        isModalShowing: CollapsedSettingsSelectors.getIsEditingMetric(state),
        items: getiOSItems(state),
        selectedValue: CollapsedSettingsSelectors.getCurrentMetric(state),
    };
};

// tough call whether to have it check against EVERY quantifier and metric, versus caching 5 of them and selecting the cache you want
// check against each means more reference checks every action that gets run, AND it recalculates more than it should as it doesn't NEED to recalculate if the rank is still 1 and quant 5 changes
// however caching all 5 means more shit in memory for something that rarely changes
// going with former solution rather than latter, more worried about memory than a few extra ref checks
const selectMapStateToPropsAndroid = createSelector(
    (state, props) => props.rank,
    CollapsedSettingsSelectors.getQuantifier1,
    CollapsedSettingsSelectors.getMetric1,
    CollapsedSettingsSelectors.getQuantifier2,
    CollapsedSettingsSelectors.getMetric2,
    CollapsedSettingsSelectors.getQuantifier3,
    CollapsedSettingsSelectors.getMetric3,
    CollapsedSettingsSelectors.getQuantifier4,
    CollapsedSettingsSelectors.getMetric4,
    CollapsedSettingsSelectors.getQuantifier5,
    CollapsedSettingsSelectors.getMetric5,
    (
        rank,
        quantifier1,
        metric1,
        quantifier2,
        metric2,
        quantifier3,
        metric3,
        quantifier4,
        metric4,
        quantifier5,
        metric5,
    ) => {
        switch (rank) {
            case 1:
                return {
                    items: generateItems(quantifier1),
                    selectedValue: metric1,
                };
            case 2:
                return {
                    items: generateItems(quantifier2),
                    selectedValue: metric2,
                };
            case 3:
                return {
                    items: generateItems(quantifier3),
                    selectedValue: metric3,
                };
            case 4:
                return {
                    items: generateItems(quantifier4),
                    selectedValue: metric4,
                };
            case 5:
                return {
                    items: generateItems(quantifier5),
                    selectedValue: metric5,
                };
            default:
                return {};
        }
    },
);

// this way only check OS once
const mapStateToProps =
    Platform.OS === 'ios' ? mapStateToPropsiOS : selectMapStateToPropsAndroid;

const mapDispatchToProps = (dispatch, ownProps) => {
    if (Platform.OS === 'ios') {
        return bindActionCreators(
            {
                selectValue: Actions.saveCollapsedMetricSetting,
                closeModal: Actions.dismissCollapsedMetricSetter,
            },
            dispatch,
        );
    } else {
        switch (ownProps.rank) {
            case 1:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveCollapsedMetricSetting1,
                    },
                    dispatch,
                );
            case 2:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveCollapsedMetricSetting2,
                    },
                    dispatch,
                );
            case 3:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveCollapsedMetricSetting3,
                    },
                    dispatch,
                );
            case 4:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveCollapsedMetricSetting4,
                    },
                    dispatch,
                );
            case 5:
                return bindActionCreators(
                    {
                        selectValue: Actions.saveCollapsedMetricSetting5,
                    },
                    dispatch,
                );
            default:
                return {};
        }
    }
};

const SettingsEditMetricsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsEditMetricsScreen;
