import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { createSelector } from 'reselect';

import {
    AVG_VELOCITY_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKV_METRIC,
    WORK_METRIC,
    FORCE_METRIC,
    POWER_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';

import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsEditKratosRepColumnsActions';
import * as KratosColumnsSettingsSelectors from 'app/redux/selectors/KratosColumnsSettingsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = metric => ({
    label: CollapsedMetricsUtility.metricString(metric),
    value: metric,
});

const items = [
    pickerItem(AVG_VELOCITY_METRIC),
    pickerItem(PKV_METRIC),
    pickerItem(ROM_METRIC),
    pickerItem(DURATION_METRIC),
    pickerItem(WORK_METRIC),
    pickerItem(FORCE_METRIC),
    pickerItem(POWER_METRIC),
];

const mapStateToPropsiOS = state => {
    return {
        isModalShowing:
            KratosColumnsSettingsSelectors.getIsEditingMetric(state),
        items,
        selectedValue: KratosColumnsSettingsSelectors.getCurrentMetric(state),
    };
};

const makeAndroidSelector = () =>
    createSelector(
        (state, props) => props.rank,
        KratosColumnsSettingsSelectors.getMetrics,
        (rank, metrics) => {
            console.tron.log(
                `rank ${rank} should return value ${metrics[rank - 1]}`,
            );
            return {
                items,
                selectedValue: metrics[rank - 1],
            };
        },
    );

const makeMapStateToPropsAndroid = () => {
    const getModel = makeAndroidSelector();
    return (state, props) => {
        return getModel(state, props);
    };
};

// this way only check OS once
const mapStateToProps =
    Platform.OS === 'ios' ? mapStateToPropsiOS : makeMapStateToPropsAndroid;

const mapDispatchToProps = (dispatch, ownProps) => {
    if (Platform.OS === 'ios') {
        return bindActionCreators(
            {
                selectValue: Actions.saveColumnSetting,
                closeModal: Actions.dismissColumnSetter,
            },
            dispatch,
        );
    } else {
        const wrapper = metric => {
            return Actions.saveColumnSetting(metric, ownProps.rank);
        };
        return bindActionCreators(
            {
                selectValue: wrapper,
            },
            dispatch,
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PickerModal);
