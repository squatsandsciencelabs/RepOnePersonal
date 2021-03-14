import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import SettingsColumnsPanel from './SettingsColumnsPanel';
import * as Actions from './SettingsColumnsActions';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';

const mapStateToProps = createSelector(
    ColumnsSettingsSelectors.getMetrics,
    metrics => {
        return {
            metrics: metrics.map(m => CollapsedMetrics.metricString(m))
        };
    },
);

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        presentEdit: Actions.presentEdit,
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsColumnsPanel);
