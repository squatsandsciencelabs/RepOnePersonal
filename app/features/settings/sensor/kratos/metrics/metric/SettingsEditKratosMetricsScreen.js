import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { createSelector } from 'reselect';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

import {
    EMPTY_METRIC,
    AVG_VELOCITY_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKV_METRIC,
    MAX_EVER_QUANTIFIER,
    MIN_EVER_QUANTIFIER,
    SET_LOSS_QUANTIFIER,
    PEAK_END_QUANTIFIER,
    PEAK_FORCE_METRIC,
    PEAK_POWER_METRIC,
    MEAN_FORCE_METRIC,
    MEAN_POWER_METRIC,
    WORK_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

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
// TODO: PEAK_FORCE_HEIGHT_METRIC and PEAK_POWER_HEIGHT_METRIC pickerItems should be added when Kratos has it
const generateItems = rollup => {
    switch (rollup) {
        case MAX_EVER_QUANTIFIER:
        case MIN_EVER_QUANTIFIER:
            return [
                pickerItem(EMPTY_METRIC),
                pickerItem(AVG_VELOCITY_METRIC),
                pickerItem(DURATION_METRIC),
                pickerItem(PKV_METRIC),
            ];
        case SET_LOSS_QUANTIFIER:
        case PEAK_END_QUANTIFIER: {
            const result = [
                pickerItem(EMPTY_METRIC),
                pickerItem(AVG_VELOCITY_METRIC),
                pickerItem(PKV_METRIC),
                pickerItem(PEAK_FORCE_METRIC),
                pickerItem(PEAK_POWER_METRIC),
                pickerItem(WORK_METRIC),
                pickerItem(ROM_METRIC),
                pickerItem(DURATION_METRIC),
            ];
            if (OpenBarbellConfig.kratosMeanForcePowerEnabled) {
                result.push(
                    pickerItem(MEAN_FORCE_METRIC),
                    pickerItem(MEAN_POWER_METRIC),
                );
            }

            return result;
        }
        default: {
            const result = [
                pickerItem(EMPTY_METRIC),
                pickerItem(AVG_VELOCITY_METRIC),
                pickerItem(PKV_METRIC),
                pickerItem(PEAK_FORCE_METRIC),
                pickerItem(PEAK_POWER_METRIC),
                pickerItem(WORK_METRIC),
                pickerItem(ROM_METRIC),
                pickerItem(DURATION_METRIC),
                // pickerItem(PEAK_FORCE_HEIGHT_METRIC),
                // pickerItem(PEAK_POWER_HEIGHT_METRIC),
            ];
            if (OpenBarbellConfig.kratosMeanForcePowerEnabled) {
                result.push(
                    pickerItem(MEAN_FORCE_METRIC),
                    pickerItem(MEAN_POWER_METRIC),
                );
            }

            return result;
        }
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

const mapStateToPropsAndroid = (state, ownProps) => {
    const rollup =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosRollupByRank(
            state,
            ownProps.rank,
        );

    const metric =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosMetricByRank(
            state,
            ownProps.rank,
        );

    return {
        items: generateItems(rollup),
        selectedValue: metric,
    };
};

// this way only check OS once
const mapStateToProps =
    Platform.OS === 'ios' ? mapStateToPropsiOS : mapStateToPropsAndroid;

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
