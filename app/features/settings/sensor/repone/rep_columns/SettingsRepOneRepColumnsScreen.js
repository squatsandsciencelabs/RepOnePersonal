import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import * as Actions from './SettingsRepOneRepColumnsActions';
import * as ColumnsSettingsSelectors from 'app/redux/selectors/ColumnsSettingsSelectors';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';
import SettingsRepOneRepColumnsPanel from './SettingsRepOneRepColumnsPanel';

const mapStateToProps = createSelector(
    ColumnsSettingsSelectors.getMetrics,
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
)(SettingsRepOneRepColumnsPanel);
