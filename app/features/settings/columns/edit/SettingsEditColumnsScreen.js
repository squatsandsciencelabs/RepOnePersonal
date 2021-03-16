import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { createSelector } from 'reselect';

import {
    AVG_VELOCITY_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKH_METRIC,
    PKV_METRIC,
    PEAK_FORCE_METRIC,
    AVERAGE_FORCE_METRIC,
    PEAK_POWER_METRIC,
    AVERAGE_POWER_METRIC,
    LINEAR_3D_AVG_VELOCITY_METRIC,
    LINEAR_3D_ROM_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';

import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsEditColumnsActions';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = (metric) => ({
    label: CollapsedMetricsUtility.metricString(metric),
    value: metric,
});

const items = [
    pickerItem(AVG_VELOCITY_METRIC),
    pickerItem(LINEAR_3D_AVG_VELOCITY_METRIC),
    pickerItem(PKV_METRIC),
    pickerItem(PKH_METRIC),
    pickerItem(ROM_METRIC),
    pickerItem(LINEAR_3D_ROM_METRIC),
    pickerItem(DURATION_METRIC),
    pickerItem(PEAK_FORCE_METRIC),
    pickerItem(AVERAGE_FORCE_METRIC),
    pickerItem(PEAK_POWER_METRIC),
    pickerItem(AVERAGE_POWER_METRIC),
];

const mapStateToPropsiOS = (state) => {
    return {
        isModalShowing: ColumnsSettingsSelectors.getIsEditingMetric(state),
        items,
        selectedValue: ColumnsSettingsSelectors.getCurrentMetric(state),
    };
};

const makeAndroidSelector = () => createSelector(
    (state, props) => props.rank,
    ColumnsSettingsSelectors.getMetrics,
    (rank, metrics) => {
        console.tron.log(`rank ${rank} should return value ${metrics[rank-1]}`);
        return {
            items,
            selectedValue: metrics[rank-1],
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
const mapStateToProps = Platform.OS === 'ios' ? mapStateToPropsiOS : makeMapStateToPropsAndroid;

const mapDispatchToProps = (dispatch, ownProps) => {
    if (Platform.OS === 'ios') {
        return bindActionCreators({
            selectValue: Actions.saveColumnSetting,
            closeModal: Actions.dismissColumnSetter
        }, dispatch);
    } else {
        const wrapper = (metric) => {
            return Actions.saveColumnSetting(metric, ownProps.rank);
        };
        return bindActionCreators({
            selectValue: wrapper,
        }, dispatch);
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PickerModal);
