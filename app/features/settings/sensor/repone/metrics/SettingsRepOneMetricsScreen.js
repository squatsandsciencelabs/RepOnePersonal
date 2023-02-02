import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SettingsRepOneMetricsPanel from './SettingsRepOneMetricsPanel';
import * as Actions from './SettingsRepOneMetricsActions';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/CollapsedSettingsSelectors';

const METRICS_NUMBER = 5;

const mapStateToProps = state => {
    const metricQuantifierTable = [];

    const metrics = {
        metric1: CollapsedSettingsSelectors.getMetric1(state),
        metric2: CollapsedSettingsSelectors.getMetric2(state),
        metric3: CollapsedSettingsSelectors.getMetric3(state),
        metric4: CollapsedSettingsSelectors.getMetric4(state),
        metric5: CollapsedSettingsSelectors.getMetric5(state),
    };

    const quantifiers = {
        quantifier1: CollapsedSettingsSelectors.getQuantifier1(state),
        quantifier2: CollapsedSettingsSelectors.getQuantifier2(state),
        quantifier3: CollapsedSettingsSelectors.getQuantifier3(state),
        quantifier4: CollapsedSettingsSelectors.getQuantifier4(state),
        quantifier5: CollapsedSettingsSelectors.getQuantifier5(state),
    };

    for (let i = 1; i <= METRICS_NUMBER; i++) {
        metricQuantifierTable[i - 1] = [
            metrics[`metric${i}`],
            quantifiers[`quantifier${i}`],
        ];
    }

    return { metricQuantifierTable };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            tapMetric: Actions.presentCollapsedMetric,
            tapQuantifier: Actions.presentQuantifier,
        },
        dispatch,
    );
};

const SettingsRepOneMetricsScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsRepOneMetricsPanel);

export default SettingsRepOneMetricsScreen;
