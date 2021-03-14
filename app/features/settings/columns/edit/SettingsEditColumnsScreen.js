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
} from 'app/configs+constants/CollapsedMetricTypes';

import PickerModal from 'app/shared_features/picker/PickerModal';
import * as Actions from './SettingsEditColumnsActions';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as CollapsedMetricsUtility from 'app/math/CollapsedMetrics';

const pickerItem = (metric) => ({
    label: Platform.OS === 'ios' ? CollapsedMetricsUtility.metricString(metric) : CollapsedMetricsUtility.metricAbbreviation(metric),
    value: metric,
});

const items = [
    pickerItem(AVG_VELOCITY_METRIC),
    pickerItem(PKV_METRIC),
    pickerItem(PKH_METRIC),
    pickerItem(ROM_METRIC),
    pickerItem(DURATION_METRIC),
];

const mapStateToPropsiOS = (state) => {
    return {
        isModalShowing: ColumnsSettingsSelectors.getIsEditingMetric(state),
        items,
        selectedValue: ColumnsSettingsSelectors.getCurrentMetric(state),
    };
};

const mapStateToPropsAndroid = (state) => {
    return {
        items,
        selectedValue: ColumnsSettingsSelectors.getCurrentMetric(state),
    };
};

// this way only check OS once
const mapStateToProps = Platform.OS === 'ios' ? mapStateToPropsiOS : mapStateToPropsAndroid;

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
