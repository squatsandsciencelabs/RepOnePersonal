import { connect } from 'react-redux';

import {
    EMPTY_METRIC,
    AVG_VELOCITY_METRIC,
    RPE_METRIC,
    DURATION_METRIC,
    ROM_METRIC,
    PKH_METRIC,
    PKV_METRIC,
    PEAK_FORCE_METRIC,
    PEAK_FORCE_HEIGHT_METRIC,
    PEAK_POWER_METRIC,
    PEAK_POWER_HEIGHT_METRIC,
    MEAN_FORCE_METRIC,
    MEAN_POWER_METRIC,
    LINEAR_3D_AVG_VELOCITY_METRIC,
    LINEAR_3D_ROM_METRIC,
    WORK_METRIC,
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
    CONCENTRIC,
} from 'app/configs+constants/CollapsedMetricTypes';
import SetAnalysis from './SetAnalysis';
import * as CollapsedSettingsSelectors from 'app/redux/selectors/CollapsedSettingsSelectors';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';
import * as DurationCalculator from 'app/utility/DurationCalculator';
import * as SetUtils from 'app/utility/SetUtils';
import _ from 'lodash';

const METRICS_NUMBER = 5;

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
                    returnValue =
                        CollapsedMetrics.getAbsLossOfAvgVelocities(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPercentLossOfAvgVelocities(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getSetLossOfAvgVelocities(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPeakEndOfAvgVelocities(set);
                    break;
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestAvgVelocityEver(
                        set,
                        allSets,
                    );
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestAvgVelocityEver(
                        set,
                        allSets,
                    );
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
                    returnValue =
                        CollapsedMetrics.getPercentLossOfDurations(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfDurations(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfDurations(set);
                    break;
                case MAX_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFastestDurationEver(
                        set,
                        allSets,
                    );
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestDurationEver(
                        set,
                        allSets,
                    );
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
                    returnValue = CollapsedMetrics.getFastestPKVEver(
                        set,
                        allSets,
                    );
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSlowestPKVEver(
                        set,
                        allSets,
                    );
                    break;
            }
            break;
        case RPE_METRIC:
            returnValue = CollapsedMetrics.getRPE1RM(set);
            break;
        case PEAK_FORCE_METRIC:
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
                    returnValue =
                        CollapsedMetrics.getPercentLossOfPeakForces(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfPeakForces(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfPeakForces(set);
                    break;
            }
            break;
        case PEAK_FORCE_HEIGHT_METRIC:
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
        case PEAK_POWER_METRIC:
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
                    returnValue =
                        CollapsedMetrics.getPercentLossOfPeakPowers(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfPeakPowers(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfPeakPowers(set);
                    break;
            }
            break;
        case PEAK_POWER_HEIGHT_METRIC:
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
        case MEAN_FORCE_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstMeanForce(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastMeanForce(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinMeanForce(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxMeanForce(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgMeanForce(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfMeanForces(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPercentLossOfMeanForces(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfMeanForces(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfMeanForces(set);
                    break;
            }
            break;
        case MEAN_POWER_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstMeanPower(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastMeanPower(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinMeanPower(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxMeanPower(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgMeanPower(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfMeanPowers(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPercentLossOfMeanPowers(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfMeanPowers(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfMeanPowers(set);
                    break;
            }
            break;
        case LINEAR_3D_AVG_VELOCITY_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getFirstLinear3DAvgVelocity(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getLastLinear3DAvgVelocity(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getMinLinear3DAvgVelocity(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getMaxLinear3DAvgVelocity(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getAvgOfLinear3DAvgVelocities(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getAbsLossOfLinear3DAvgVelocities(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPercentLossOfLinear3DAvgVelocities(
                            set,
                        );
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getSetLossOfLinear3DAvgVelocities(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPeakEndOfLinear3DAvgVelocities(set);
                    break;
                case MAX_EVER_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getFastestLinear3DAvgVelocityEver(
                            set,
                            allSets,
                        );
                    break;
                case MIN_EVER_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getSlowestLinear3DAvgVelocityEver(
                            set,
                            allSets,
                        );
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
                    returnValue =
                        CollapsedMetrics.getAbsLossOfLinear3DROMs(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPercentLossOfLinear3DROMs(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getSetLossOfLinear3DROMs(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue =
                        CollapsedMetrics.getPeakEndOfLinear3DROMs(set);
                    break;
            }
            break;
        case WORK_METRIC:
            switch (quantifier) {
                case FIRST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getFirstWork(set);
                    break;
                case LAST_REP_QUANTIFIER:
                    returnValue = CollapsedMetrics.getLastWork(set);
                    break;
                case MIN_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMinWork(set);
                    break;
                case MAX_QUANTIFIER:
                    returnValue = CollapsedMetrics.getMaxWork(set);
                    break;
                case AVG_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAvgWork(set);
                    break;
                case ABS_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getAbsLossOfWork(set);
                    break;
                case PERCENT_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPercentLossOfWork(set);
                    break;
                case SET_LOSS_QUANTIFIER:
                    returnValue = CollapsedMetrics.getSetLossOfWork(set);
                    break;
                case PEAK_END_QUANTIFIER:
                    returnValue = CollapsedMetrics.getPeakEndOfWork(set);
                    break;
            }
            break;
    }

    return returnValue !== null ? SetUtils.formatMetric(returnValue) : '---';
};

const metricDescription = (
    quantifier,
    metric,
    rpe,
    weightMetric,
    phase = undefined,
) => {
    if (metric === RPE_METRIC) {
        if (rpe) {
            return (
                weightMetric +
                ' @ ' +
                rpe +
                ' ' +
                CollapsedMetrics.metricAbbreviation(metric) +
                '\ne1RM'
            );
        } else {
            return 'RPE e1RM';
        }
    }

    if (quantifier === EMPTY_QUANTIFIER || metric === EMPTY_METRIC) {
        return '';
    }

    const phaseString = phase
        ? CollapsedMetrics.phaseAbbreviation(phase) + ' '
        : '';

    return (
        CollapsedMetrics.quantifierAbbreviation(quantifier) +
        ' ' +
        phaseString +
        CollapsedMetrics.metricAbbreviation(metric)
    );
};

const unit = (metric, quantifier) =>
    metric === RPE_METRIC
        ? '---'
        : CollapsedMetrics.metricUnit(metric, quantifier);

const mapStateToProps = (state, ownProps) => {
    // cloning the set as we're mutating the object
    const set = _.cloneDeep(ownProps.set);

    const allSets = SetsSelectors.getAllSets(state);

    const model = {
        rpe: set.rpe,
    };

    if (set.deviceType === 'Kratos') {
        // transforming set reps into the array of objects with 'eccentric' and 'concentric' keys - normalizing the set to be consistent with the RepOne
        const reps = set.reps.map(rep => SetUtils.getKratosRepRows(rep));
        const setConcentric = {
            ...set,
            reps: reps.map(rep => rep.concentric),
        };
        const setEccentric = {
            ...set,
            reps: reps.map(rep => rep.eccentric),
        };

        // get all 5 metrics, rollups, phases
        for (let i = 1; i <= METRICS_NUMBER; i++) {
            const metric =
                KratosCollapsedSettingsSetMetricsSelectors.getKratosMetricByRank(
                    state,
                    i,
                );
            const rollup =
                KratosCollapsedSettingsSetMetricsSelectors.getKratosRollupByRank(
                    state,
                    i,
                );
            const phase =
                KratosCollapsedSettingsSetMetricsSelectors.getKratosPhaseByRank(
                    state,
                    i,
                );
            // choosing the set data depending on the phase
            const setData = phase === CONCENTRIC ? setConcentric : setEccentric;

            model[`value${i}`] = metricValue(setData, allSets, rollup, metric);
            model[`unit${i}`] = unit(metric, rollup);
            model[`description${i}`] = metricDescription(
                rollup,
                metric,
                set.rpe,
                set.metric,
                phase,
            );
        }

        return model;
    }

    const weightMetric = set.metric;
    const rpe = set.rpe;

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
        const quantifier = quantifiers[`quantifier${i}`];
        const metric = metrics[`metric${i}`];

        model[`value${i}`] = metricValue(set, allSets, quantifier, metric);
        model[`unit${i}`] = unit(metric, quantifier);
        model[`description${i}`] = metricDescription(
            quantifier,
            metric,
            rpe,
            weightMetric,
        );
    }

    return model;
};

const SetAnalysisScreen = connect(mapStateToProps)(SetAnalysis);

export default SetAnalysisScreen;
