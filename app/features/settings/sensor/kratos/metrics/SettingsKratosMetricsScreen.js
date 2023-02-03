import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsKratosMetricsPanel from './SettingsKratosMetricsPanel';
import * as Actions from './SettingsKratosMetricsActions';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

const METRICS_NUMBER = 5;

const mapStateToProps = state => {
    const metricRollupPhaseTable = [];

    const metrics = {
        metric1: CollapsedSettingsSelectors.getKratosMetric1(state),
        metric2: CollapsedSettingsSelectors.getKratosMetric2(state),
        metric3: CollapsedSettingsSelectors.getKratosMetric3(state),
        metric4: CollapsedSettingsSelectors.getKratosMetric4(state),
        metric5: CollapsedSettingsSelectors.getKratosMetric5(state),
    };

    const rollups = {
        rollup1: CollapsedSettingsSelectors.getKratosRollup1(state),
        rollup2: CollapsedSettingsSelectors.getKratosRollup2(state),
        rollup3: CollapsedSettingsSelectors.getKratosRollup3(state),
        rollup4: CollapsedSettingsSelectors.getKratosRollup4(state),
        rollup5: CollapsedSettingsSelectors.getKratosRollup5(state),
    };

    const phases = {
        phase1: CollapsedSettingsSelectors.getKratosPhase1(state),
        phase2: CollapsedSettingsSelectors.getKratosPhase2(state),
        phase3: CollapsedSettingsSelectors.getKratosPhase3(state),
        phase4: CollapsedSettingsSelectors.getKratosPhase4(state),
        phase5: CollapsedSettingsSelectors.getKratosPhase5(state),
    };

    for (let i = 1; i <= METRICS_NUMBER; i++) {
        metricRollupPhaseTable[i - 1] = [
            metrics[`metric${i}`],
            rollups[`rollup${i}`],
            phases[`phase${i}`],
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
