import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { createSelector } from 'reselect';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

import {
    EMPTY_METRIC,
    AVG_VELOCITY_METRIC,
    RPE_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKH_METRIC,
    PKV_METRIC,
    FORCE_METRIC,
    FORCE_HEIGHT_METRIC,
    POWER_METRIC,
    POWER_HEIGHT_METRIC,
    LINEAR_3D_AVG_VELOCITY_METRIC,
    LINEAR_3D_ROM_METRIC,
    AVG_QUANTIFIER,
    MAX_EVER_QUANTIFIER,
    MIN_EVER_QUANTIFIER,
    ABS_LOSS_QUANTIFIER,
    PERCENT_LOSS_QUANTIFIER,
    SET_LOSS_QUANTIFIER,
    PEAK_END_QUANTIFIER,
} from 'app/configs+constants/CollapsedMetricTypes';

import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsEditKratosMetricsActions';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = metric => ({
    label:
        Platform.OS === 'ios'
            ? CollapsedMetricsUtility.metricString(metric)
            : CollapsedMetricsUtility.metricAbbreviation(metric),
    value: metric,
});

// NOTE: To avoid an android picker bug, the item order is explicitly set to Empty -> PKH -> ROM -> others
// Basically, if you don't do this, it's possible for the Picker to trigger each time Quantifier changes
// See https://github.com/facebook/react-native/issues/16849 for more information
// Once the bug is resolved, can redo the order into something that makes more sense
const generateItems = rollup => {
    switch (rollup) {
        case MAX_EVER_QUANTIFIER:
        case MIN_EVER_QUANTIFIER:
            return OpenBarbellConfig.bulkMetricsEnabled
                ? [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(LINEAR_3D_AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(FORCE_METRIC),
                      pickerItem(POWER_METRIC),
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
        case AVG_QUANTIFIER:
        case ABS_LOSS_QUANTIFIER:
        case PERCENT_LOSS_QUANTIFIER:
            return OpenBarbellConfig.bulkMetricsEnabled
                ? [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(LINEAR_3D_AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(FORCE_METRIC),
                      pickerItem(POWER_METRIC),
                      pickerItem(ROM_METRIC),
                      pickerItem(LINEAR_3D_ROM_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
                      pickerItem(PKH_METRIC),
                      pickerItem(FORCE_HEIGHT_METRIC),
                      pickerItem(POWER_HEIGHT_METRIC),
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
        case SET_LOSS_QUANTIFIER:
        case PEAK_END_QUANTIFIER:
            return OpenBarbellConfig.bulkMetricsEnabled
                ? [
                      pickerItem(EMPTY_METRIC),
                      pickerItem(AVG_VELOCITY_METRIC),
                      pickerItem(LINEAR_3D_AVG_VELOCITY_METRIC),
                      pickerItem(PKV_METRIC),
                      pickerItem(FORCE_METRIC),
                      pickerItem(POWER_METRIC),
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
                      pickerItem(PKH_METRIC),
                      pickerItem(FORCE_METRIC),
                      pickerItem(FORCE_HEIGHT_METRIC),
                      pickerItem(POWER_METRIC),
                      pickerItem(POWER_HEIGHT_METRIC),
                      pickerItem(ROM_METRIC),
                      pickerItem(LINEAR_3D_ROM_METRIC),
                      pickerItem(DURATION_METRIC),
                      pickerItem(RPE_METRIC),
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
    CollapsedSettingsSelectors.getCurrentKratosMetric,
    metric => {
        return generateItems(metric);
    },
);

const mapStateToPropsiOS = state => {
    const isModalShowing = CollapsedSettingsSelectors.getIsEditingMetric(state);

    const selectedValue =
        CollapsedSettingsSelectors.getCurrentKratosMetric(state);

    return {
        isModalShowing,
        items: getiOSItems(state),
        selectedValue,
    };
};

// tough call whether to have it check against EVERY quantifier and metric, versus caching 5 of them and selecting the cache you want
// check against each means more reference checks every action that gets run, AND it recalculates more than it should as it doesn't NEED to recalculate if the rank is still 1 and quant 5 changes
// however caching all 5 means more shit in memory for something that rarely changes
// going with former solution rather than latter, more worried about memory than a few extra ref checks
const selectMapStateToPropsAndroid = createSelector(
    (state, props) => props.rank,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup1,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric1,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup2,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric2,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup3,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric3,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup4,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric4,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup5,
    KratosCollapsedSettingsSetMetricsSelectors.getKratosMetric5,
    (
        rank,
        rollup1,
        metric1,
        rollup2,
        metric2,
        rollup3,
        metric3,
        rollup4,
        metric4,
        rollup5,
        metric5,
    ) => {
        const items = [
            [rollup1, metric1],
            [rollup2, metric2],
            [rollup3, metric3],
            [rollup4, metric4],
            [rollup5, metric5],
        ];

        const item = items[rank - 1];

        return item
            ? {
                  items: generateItems(item[0]),
                  selectedValue: item[1],
              }
            : {};
    },
);

// this way only check OS once
const mapStateToProps =
    Platform.OS === 'ios' ? mapStateToPropsiOS : selectMapStateToPropsAndroid;

const mapDispatchToProps = (dispatch, ownProps) => {
    if (Platform.OS === 'ios') {
        return bindActionCreators(
            {
                selectValue: Actions.saveKratosCollapsedMetricSetting,
                closeModal: Actions.dismissKratosCollapsedMetricSetter,
            },
            dispatch,
        );
    } else {
        // const actions = {
        //     saveCollapsedMetricSetting1: Actions.saveCollapsedMetricSetting1,
        //     saveCollapsedMetricSetting2: Actions.saveCollapsedMetricSetting2,
        //     saveCollapsedMetricSetting3: Actions.saveCollapsedMetricSetting3,
        //     saveCollapsedMetricSetting4: Actions.saveCollapsedMetricSetting4,
        //     saveCollapsedMetricSetting5: Actions.saveCollapsedMetricSetting5,
        // };
        // TODO: test if works properly
        console.log('ownProps.rank', ownProps.rank);
        // const action = actions[`saveCollapsedMetricSetting${ownProps.rank}`];
        return bindActionCreators(
            {
                selectValue: value =>
                    Actions.saveKratosCollapsedMetricSettingAndroid(
                        value,
                        ownProps.rank,
                    ),
            },
            dispatch,
        );
    }
};

const SettingsEditKratosMetricsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsEditKratosMetricsScreen;
