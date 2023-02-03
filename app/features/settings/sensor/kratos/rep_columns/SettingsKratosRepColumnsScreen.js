import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import * as Actions from './SettingsKratosRepColumnsActions';
import * as KratosColumnsSettingsSelectors from 'app/redux/selectors/KratosColumnsSettingsSelectors';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';
import SettingsKratosRepColumnsPanel from './SettingsKratosRepColumnsPanel';

const mapStateToProps = createSelector(
    KratosColumnsSettingsSelectors.getMetrics,
    metrics => {
        return {
            metrics: metrics.map(m => CollapsedMetrics.metricString(m)),
        };
    },
);

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            presentEdit: Actions.presentEdit,
        },
        dispatch,
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsKratosRepColumnsPanel);
