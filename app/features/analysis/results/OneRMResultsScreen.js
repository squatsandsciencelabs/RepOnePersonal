import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import OneRMResultsView from './OneRMResultsView';
import * as Actions from './OneRMResultsActions';
import * as SettingsSelectors from 'app/redux/selectors/SettingsSelectors';
import * as AnalysisSelectors from 'app/redux/selectors/AnalysisSelectors';

const getShouldDisplayRegression = createSelector(
    AnalysisSelectors.getIsR2HighEnough,
    AnalysisSelectors.getRegressionPoints,
    AnalysisSelectors.getActiveChartData,
    AnalysisSelectors.getIsRegressionNegative,
    (isR2HighEnough, regressionPoints, activeChartData, isNegative) => {
        return (
            isR2HighEnough &&
            regressionPoints &&
            regressionPoints.length === 2 &&
            activeChartData.length >= 5 &&
            isNegative
        );
    },
);

const getRegLeftPoint = createSelector(
    AnalysisSelectors.getRegressionPoints,
    getShouldDisplayRegression,
    (points, shouldDisplayRegression) => {
        if (!shouldDisplayRegression) {
            return null;
        }
        return points[0];
    },
);

const getRegRightPoint = createSelector(
    AnalysisSelectors.getRegressionPoints,
    getShouldDisplayRegression,
    (points, shouldDisplayRegression) => {
        if (!shouldDisplayRegression) {
            return null;
        }
        return points[1];
    },
);

const getE1RM = createSelector(
    AnalysisSelectors.getE1RM,
    getShouldDisplayRegression,
    (e1RM, shouldDisplayRegression) => {
        if (!shouldDisplayRegression) {
            return null;
        }
        return e1RM;
    },
);

const getMinX = createSelector(AnalysisSelectors.getMinX, x => {
    return x * 0.9;
});

const getMaxX = createSelector(
    AnalysisSelectors.getMaxX,
    getRegRightPoint,
    getShouldDisplayRegression,
    (x, regRightPoint, shouldDisplayRegression) => {
        const v = x * 1.1;
        if (!shouldDisplayRegression) {
            return v;
        }
        return Math.max(v, regRightPoint.x);
    },
);

const getMaxY = createSelector(AnalysisSelectors.getMaxY, y => {
    return y * 1.1;
});

const mapStateToProps = state => {
    return {
        velocity: AnalysisSelectors.getAnalysisVelocity(state),
        e1RM: getE1RM(state),
        metric: SettingsSelectors.getDefaultMetric(state),
        r2: AnalysisSelectors.getR2(state),
        shouldDisplayRegression: getShouldDisplayRegression(state),
        activeChartData: AnalysisSelectors.getActiveChartData(state),
        errorChartData: AnalysisSelectors.getErrorChartData(state),
        unusedChartData: AnalysisSelectors.getUnusedChartData(state),
        regLeftPoint: getRegLeftPoint(state),
        regRightPoint: getRegRightPoint(state),
        minX: getMinX(state),
        maxX: getMaxX(state),
        maxY: getMaxY(state),
        dragged: AnalysisSelectors.getAnalysisDragged(state),
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            tappedSet: Actions.tappedSet,
            presentAlgorithm: Actions.presentAlgorithm,
            presentBestResults: Actions.presentBestResults,
        },
        dispatch,
    );
};

const OneRMChartScreen = connect(
    mapStateToProps,
    mapDispatchToProps,
)(OneRMResultsView);

export default OneRMChartScreen;
