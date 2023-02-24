import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
    EMPTY_METRIC,
    AVG_VELOCITY_METRIC,
    RPE_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKH_METRIC,
    PKV_METRIC,
    FORCE_METRIC,
    FORCE_HEIGHT_METRIC,
    POWER_METRIC,
    POWER_HEIGHT_METRIC,
    LINEAR_3D_AVG_VELOCITY_METRIC,
    LINEAR_3D_ROM_METRIC,

    EMPTY_QUANTIFIER,
    FIRST_REP_QUANTIFIER,
    LAST_REP_QUANTIFIER,
    MIN_QUANTIFIER,
    MAX_QUANTIFIER,
    AVG_QUANTIFIER,
    ABS_LOSS_QUANTIFIER,
    PERCENT_LOSS_QUANTIFIER,
    MAX_EVER_QUANTIFIER,
    MIN_EVER_QUANTIFIER,
    SET_LOSS_QUANTIFIER,
    PEAK_END_QUANTIFIER,
} from 'app/configs+constants/CollapsedMetricTypes';
import SetAnalysis from './SetAnalysis';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/CollapsedSettingsSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';
import * as DurationCalculator from 'app/utility/DurationCalculator';
import * as SetUtils from 'app/utility/SetUtils';

const metricValue = (set, allSets, quantifier, metric) => {
    let returnValue = null;

    switch (metric) {
        case AVG_VELOCITY_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstAvgVelocity(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastAvgVelocity(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinAvgVelocity(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxAvgVelocity(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgOfAvgVelocities(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfAvgVelocities(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfAvgVelocities(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfAvgVelocities(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfAvgVelocities(set);
                    break;                    
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestAvgVelocityEver(set, allSets);
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestAvgVelocityEver(set, allSets);
                    break;
            }
            break;
        case DURATION_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstDuration(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastDuration(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinDuration(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxDuration(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgDuration(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfDurations(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfDurations(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfDurations(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfDurations(set);
                    break; 
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestDurationEver(set, allSets);
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestDurationEver(set, allSets);
                    break;
            }
            if (returnValue !== null) {
                returnValue = DurationCalculator.displayDuration(returnValue);
            }
            break;
        case ROM_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstROM(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastROM(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinROM(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxROM(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgROM(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfROMs(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfROMs(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfROMs(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfROMs(set);
                    break; 
            }
            break;
        case PKH_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstPKH(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastPKH(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinPKH(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxPKH(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgPKH(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfPKHs(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfPKHs(set);
                    break;
            }
            break;
        case PKV_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstPKV(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastPKV(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinPKV(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxPKV(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgPKV(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfPKVs(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfPKVs(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfPKVs(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfPKVs(set);
                    break; 
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestPKVEver(set, allSets);
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestPKVEver(set, allSets);
                    break;
            }
            break;
        case RPE_METRIC:
            returnValue = CollapsedMetrics.getRPE1RM(set);
            break;
        case FORCE_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstPeakForce(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastPeakForce(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinPeakForce(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxPeakForce(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgPeakForce(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfPeakForces(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfPeakForces(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfPeakForces(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfPeakForces(set);
                    break;                    
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestPeakForceEver(set, allSets);
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestPeakForceEver(set, allSets);
                    break;
            }
            break;
        case FORCE_HEIGHT_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstPeakForceHeight(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastPeakForceHeight(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinPeakForceHeight(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxPeakForceHeight(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgPeakForceHeight(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getAbsLossOfPeakForceHeights(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPercentLossOfPeakForceHeights(set);
                    break;
            }
            break;
        case POWER_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstPeakPower(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastPeakPower(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinPeakPower(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxPeakPower(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgPeakPower(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfPeakPowers(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfPeakPowers(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfPeakPowers(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfPeakPowers(set);
                    break;                    
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestPeakPowerEver(set, allSets);
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestPeakPowerEver(set, allSets);
                    break;
            }
            break;
        case POWER_HEIGHT_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstPeakPowerHeight(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastPeakPowerHeight(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinPeakPowerHeight(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxPeakPowerHeight(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgPeakPowerHeight(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getAbsLossOfPeakPowerHeights(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPercentLossOfPeakPowerHeights(set);
                    break;
            }
            break;
        case LINEAR_3D_AVG_VELOCITY_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstLinear3DAvgVelocity(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastLinear3DAvgVelocity(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinLinear3DAvgVelocity(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxLinear3DAvgVelocity(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgOfLinear3DAvgVelocities(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfLinear3DAvgVelocities(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfLinear3DAvgVelocities(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfLinear3DAvgVelocities(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfLinear3DAvgVelocities(set);
                    break;                    
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestLinear3DAvgVelocityEver(set, allSets);
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestLinear3DAvgVelocityEver(set, allSets);
                    break;
            }
            break;
        case LINEAR_3D_ROM_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstLinear3DROM(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastLinear3DROM(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinLinear3DROM(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxLinear3DROM(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgLinear3DROM(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfLinear3DROMs(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfLinear3DROMs(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfLinear3DROMs(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfLinear3DROMs(set);
                    break; 
            }
            break;
    }

    return returnValue ? SetUtils.formatMetric(returnValue) : '---';
};

const metricDescription = (quantifier, metric, rpe, weightMetric) => {
    if (metric === RPE_METRIC) {
        if (rpe) {
            return weightMetric + ' @ ' + rpe + " " + CollapsedMetrics.metricAbbreviation(metric) +  "\ne1RM";       
        } else {
            return "RPE e1RM";
        }
    }

    if (quantifier === EMPTY_QUANTIFIER || metric === EMPTY_METRIC) {
        return '';
    }
    return CollapsedMetrics.quantifierAbbreviation(quantifier) + " " + CollapsedMetrics.metricAbbreviation(metric);
};

const unit = (metric, quantifier) =>
    metric === RPE_METRIC
        ? '---'
        : CollapsedMetrics.metricUnit(metric, quantifier);

// selector

const makeSelector = () => createSelector(
    (state, props) => props.set,
    SetsSelectors.getAllSets,
    CollapsedSettingsSelectors.getMetric1,
    CollapsedSettingsSelectors.getQuantifier1,
    CollapsedSettingsSelectors.getMetric2,
    CollapsedSettingsSelectors.getQuantifier2,
    CollapsedSettingsSelectors.getMetric3,
    CollapsedSettingsSelectors.getQuantifier3,
    CollapsedSettingsSelectors.getMetric4,
    CollapsedSettingsSelectors.getQuantifier4,
    CollapsedSettingsSelectors.getMetric5,
    CollapsedSettingsSelectors.getQuantifier5,
    (set, allSets, metric1, quantifier1, metric2, quantifier2, metric3, quantifier3, metric4, quantifier4, metric5, quantifier5) => {
        const rpe = set.rpe;
        const weightMetric = set.metric;
        return {
            value1: metricValue(set, allSets, quantifier1, metric1),
            unit1: unit(metric1, quantifier1),
            description1: metricDescription(quantifier1, metric1, rpe, weightMetric),
            value2: metricValue(set, allSets, quantifier2, metric2),
            description2: metricDescription(quantifier2, metric2, rpe, weightMetric),
            unit2: unit(metric2, quantifier2),
            value3: metricValue(set, allSets, quantifier3, metric3),
            description3: metricDescription(quantifier3, metric3, rpe, weightMetric),
            unit3: unit(metric3, quantifier3),
            value4: metricValue(set, allSets, quantifier4, metric4),
            description4: metricDescription(quantifier4, metric4, rpe, weightMetric),
            unit4: unit(metric4, quantifier4),
            value5: metricValue(set, allSets, quantifier5, metric5),
            description5: metricDescription(quantifier5, metric5, rpe, weightMetric),
            unit5: unit(metric5, quantifier5),
            rpe: rpe,
        };
    }
);

// map state to props
const makeMapStateToProps = () => {
    const getModel = makeSelector();
    return (state, props) => {
        return getModel(state, props);
    };
};

const SetAnalysisScreen = connect(
    makeMapStateToProps,
)(SetAnalysis);

export default SetAnalysisScreen;
