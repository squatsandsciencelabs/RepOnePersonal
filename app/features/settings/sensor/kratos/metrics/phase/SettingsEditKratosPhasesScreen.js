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
    label: CollapsedMetricsUtility.phaseString(phase),
    value: phase,
});

const items = [pickerItem(CONCENTRIC), pickerItem(ECCENTRIC)];

const mapStateToPropsiOS = state => {
    const isModalShowing =
        KratosCollapsedSettingsSetMetricsSelectors.getIsEditingPhase(state);

    const selectedValue =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosPhase(state);

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
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase1(
                        state,
                    ),
            };
        case 2:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase2(
                        state,
                    ),
            };
        case 3:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase3(
                        state,
                    ),
            };
        case 4:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase4(
                        state,
                    ),
            };
        case 5:
            return {
                items,
                selectedValue:
                    KratosCollapsedSettingsSetMetricsSelectors.getKratosPhase5(
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
                selectValue: Actions.savePhaseSetting,
                closeModal: Actions.dismissPhaseSetter,
            },
            dispatch,
        );
    } else {
        switch (ownProps.rank) {
            case 1:
                return bindActionCreators(
                    {
                        selectValue: Actions.savePhase1Setting,
                    },
                    dispatch,
                );
            case 2:
                return bindActionCreators(
                    {
                        selectValue: Actions.savePhase2Setting,
                    },
                    dispatch,
                );
            case 3:
                return bindActionCreators(
                    {
                        selectValue: Actions.savePhase3Setting,
                    },
                    dispatch,
                );
            case 4:
                return bindActionCreators(
                    {
                        selectValue: Actions.savePhase4Setting,
                    },
                    dispatch,
                );
            case 5:
                return bindActionCreators(
                    {
                        selectValue: Actions.savePhase5Setting,
                    },
                    dispatch,
                );
            default:
                return {};
        }
    }
};

const SettingsEditKratosPhasesScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PickerModal);

export default SettingsEditKratosPhasesScreen;
