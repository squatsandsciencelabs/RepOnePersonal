import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsKratosMetricsPanel from './SettingsKratosMetricsPanel';
import * as Actions from './SettingsKratosMetricsActions';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

const METRICS_NUMBER = 5;

const mapStateToProps = state => {
    const metricRollupPhaseTable = [];

    for (let i = 1; i <= METRICS_NUMBER; i++) {
        metricRollupPhaseTable[i - 1] = [
            CollapsedSettingsSelectors.getKratosMetricByRank(state, i),
            CollapsedSettingsSelectors.getKratosRollupByRank(state, i),
            CollapsedSettingsSelectors.getKratosPhaseByRank(state, i),
        ];
    }

    return { metricRollupPhaseTable };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            tapMetric: Actions.presentMetric,
            tapRollup: Actions.presentRollup,
            tapPhase: Actions.presentPhase,
        },
        dispatch,
    );
};

const SettingsKratosMetricsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsKratosMetricsPanel);

export default SettingsKratosMetricsScreen;
