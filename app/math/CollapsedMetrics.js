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
    ECCENTRIC,
    CONCENTRIC,
    WORK_METRIC,
    WORK_LOCATION_METRIC,
    FORCE_LOCATION_METRIC,
    POWER_LOCATION_METRIC,
} from 'app/configs+constants/CollapsedMetricTypes';
import * as SetUtils from 'app/utility/SetUtils';
import { getTotalKratosDiscsInertialConstant } from 'app/utility/KratosUtils';
import { millimetersToMeters } from 'app/utility/DistanceConversion';
import { newtonsToPounds } from 'app/utility/ForceConversion';

// unique metrics

const getMetrics = (set, metricFunction) => {
    const metrics = [];

    if (!SetUtils.isDeleted(set)) {
        set.reps.forEach(rep => {
            if (rep.isValid === true && rep.removed === false) {
                const metric = Number(metricFunction(rep));
                metrics.push(metric);
            }
        });
    }

    return metrics;
};

export const getRPE = set => {
    return set.rpe;
};

export const getAvgVelocities = set => {
    return getMetrics(
        set,
        r =>
            (set.deviceType === 'Kratos'
                ? r.avgLinearVelocity // r.avgLinearVelocity is the selected eccentric or concentric average linear velocity
                : r.averageVelocity) / 1000,
    );
};

export const getPKVs = set => {
    return getMetrics(
        set,
        r =>
            (set.deviceType === 'Kratos'
                ? r.peakLinearVelocity // r.peakLinearVelocity is the selected eccentric or concentric peak linear velocity
                : r.peakVelocity) / 1000,
    );
};

export const getPKHs = set => {
    return getMetrics(
        set,
        r =>
            (100 * (set.deviceType === 'Kratos' ? null : r.peakHeight)) / r.rom,
    );
};

export const getROMs = set => {
    return getMetrics(set, r => r.rom);
};

export const getDurations = set => {
    return getMetrics(set, r => r.duration);
};

export const getPeakForces = set =>
    getMetrics(set, r => {
        if (set.deviceType === 'Kratos') {
            const totalInertialConstant = getTotalKratosDiscsInertialConstant(
                set.kratosDiscs,
            );
            // r.partialPeakForce is the selected eccentric or concentric partial peak force
            return totalInertialConstant &&
                r.partialPeakForce !== null &&
                r.partialPeakForce !== undefined
                ? newtonsToPounds(r.partialPeakForce) * totalInertialConstant
                : null;
        }

        return r.peakForce !== null && r.peakForce !== undefined
            ? newtonsToPounds(r.peakForce)
            : null;
    });

export const getPeakForceHeights = set =>
    getMetrics(set, r =>
        r.peakForceHeight !== null && r.peakForceHeight !== undefined
            ? r.peakForceHeight
            : null,
    );

export const getAverageForces = set =>
    getMetrics(set, r =>
        r.averageForce !== null && r.averageForce !== undefined
            ? newtonsToPounds(r.averageForce)
            : null,
    );

export const getPeakPowers = set =>
    getMetrics(set, r => {
        if (set.deviceType === 'Kratos') {
            const totalInertialConstant = getTotalKratosDiscsInertialConstant(
                set.kratosDiscs,
            );

            // r.partialPeakPower is the selected eccentric or concentric partial peak power
            return totalInertialConstant &&
                r.partialPeakPower !== null &&
                r.partialPeakPower !== undefined
                ? r.partialPeakPower * totalInertialConstant
                : null;
        }

        return null;
    });

export const getPeakPowerHeights = set =>
    getMetrics(set, r =>
        r.peakPowerHeight !== null && r.peakPowerHeight !== undefined
            ? r.peakPowerHeight
            : null,
    );

export const getAveragePowers = set =>
    getMetrics(set, r =>
        r.averagePower !== null && r.averagePower !== undefined
            ? r.averagePower
            : null,
    );

export const getLinear3DAvgVelocities = set =>
    getMetrics(set, r => r.linear3DAverageVelocity / 1000);

export const getLinear3DROMs = set => getMetrics(set, r => r.linear3DROM);

export const getWorks = set =>
    getMetrics(set, r => {
        const convertedRom = millimetersToMeters(r.rom);

        if (set.deviceType === 'Kratos') {
            const totalInertialConstant = getTotalKratosDiscsInertialConstant(
                set.kratosDiscs,
            );

            // r.partialPeakForce is the selected eccentric or concentric partial peak force
            return totalInertialConstant &&
                r.partialPeakForce !== null &&
                r.partialPeakForce !== undefined
                ? r.partialPeakForce * totalInertialConstant * convertedRom
                : null;
        }

        return r.peakForce !== null && r.peakForce !== undefined
            ? r.peakForce * convertedRom
            : null;
    });

// Average Quantifiers

const getAvgOfMetrics = metrics => {
    if (metrics.length <= 0) {
        return null;
    }

    const sum = metrics.reduce((previous, current) => current + previous);
    return Number((sum / metrics.length).toFixed(2));
};

export const getAvgOfAvgVelocities = set => {
    const velocities = getAvgVelocities(set);
    return getAvgOfMetrics(velocities);
};

export const getAvgPKV = set => {
    const pkvs = getPKVs(set);
    return getAvgOfMetrics(pkvs);
};

export const getAvgROM = set => {
    const roms = getROMs(set);
    return getAvgOfMetrics(roms);
};

export const getAvgDuration = set => {
    const durations = getDurations(set);
    return getAvgOfMetrics(durations);
};

export const getAvgPeakForce = set => {
    const peakForces = getPeakForces(set);
    return getAvgOfMetrics(peakForces);
};

export const getAvgOfAvgForces = set => {
    const averageForces = getAverageForces(set);
    return getAvgOfMetrics(averageForces);
};

export const getAvgPeakPower = set => {
    const peakPowers = getPeakPowers(set);
    return getAvgOfMetrics(peakPowers);
};

export const getAvgOfAvgPowers = set => {
    const averagePowers = getAveragePowers(set);
    return getAvgOfMetrics(averagePowers);
};

export const getAvgOfLinear3DAvgVelocities = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getAvgOfMetrics(velocities);
};

export const getAvgLinear3DROM = set => {
    const roms = getLinear3DROMs(set);
    return getAvgOfMetrics(roms);
};

export const getAvgPKH = set => {
    const pkhs = getPKHs(set);
    return getAvgOfMetrics(pkhs);
};

export const getAvgPeakForceHeight = set => {
    const peakForceHeights = getPeakForceHeights(set);
    return getAvgOfMetrics(peakForceHeights);
};

export const getAvgPeakPowerHeight = set => {
    const peakPowerHeights = getPeakPowerHeights(set);
    return getAvgOfMetrics(peakPowerHeights);
};

export const getAvgWork = set => {
    const works = getWorks(set);
    return getAvgOfMetrics(works);
};

// Absolute Loss Quantifiers

const getAbsLossOfMetrics = metrics => {
    if (metrics.length <= 0) {
        return null;
    }

    const max = Math.max(...metrics);
    const min = Math.min(...metrics);

    return Number((max - min).toFixed(2));
};

export const getAbsLossOfAvgVelocities = set => {
    const velocities = getAvgVelocities(set);
    return getAbsLossOfMetrics(velocities);
};

export const getAbsLossOfPKVs = set => {
    const pkvs = getPKVs(set);
    return getAbsLossOfMetrics(pkvs);
};

export const getAbsLossOfROMs = set => {
    const roms = getROMs(set);
    return getAbsLossOfMetrics(roms);
};

export const getAbsLossOfDurations = set => {
    const durations = getDurations(set);
    return getAbsLossOfMetrics(durations);
};

export const getAbsLossOfPeakForces = set => {
    const peakForces = getPeakForces(set);
    return getAbsLossOfMetrics(peakForces);
};

export const getAbsLossOfAvgForces = set => {
    const averageForces = getAverageForces(set);
    return getAbsLossOfMetrics(averageForces);
};

export const getAbsLossOfPeakPowers = set => {
    const peakPowers = getPeakPowers(set);
    return getAbsLossOfMetrics(peakPowers);
};

export const getAbsLossOfAvgPowers = set => {
    const averagePowers = getAveragePowers(set);
    return getAbsLossOfMetrics(averagePowers);
};

export const getAbsLossOfLinear3DAvgVelocities = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getAbsLossOfMetrics(velocities);
};

export const getAbsLossOfLinear3DROMs = set => {
    const roms = getLinear3DROMs(set);
    return getAbsLossOfMetrics(roms);
};

export const getAbsLossOfPKHs = set => {
    const pkhs = getPKHs(set);
    return getAbsLossOfMetrics(pkhs);
};

export const getAbsLossOfPeakForceHeights = set => {
    const peakForceHeights = getPeakForceHeights(set);
    return getAbsLossOfMetrics(peakForceHeights);
};

export const getAbsLossOfPeakPowerHeights = set => {
    const peakPowerHeights = getPeakPowerHeights(set);
    return getAbsLossOfMetrics(peakPowerHeights);
};

export const getAbsLossOfWork = set => {
    const works = getWorks(set);
    return getAbsLossOfMetrics(works);
};
// Percent Loss Quantifiers

const getPercentLossOfMetrics = metrics => {
    if (metrics.length <= 0) {
        return null;
    }

    const max = Math.max(...metrics);
    const min = Math.min(...metrics);

    return Number(((100 * (max - min)) / max).toFixed(2));
};

export const getPercentLossOfAvgVelocities = set => {
    const velocities = getAvgVelocities(set);
    return getPercentLossOfMetrics(velocities);
};

export const getPercentLossOfPKVs = set => {
    const pkvs = getPKVs(set);
    return getPercentLossOfMetrics(pkvs);
};

export const getPercentLossOfROMs = set => {
    const roms = getROMs(set);
    return getPercentLossOfMetrics(roms);
};

export const getPercentLossOfDurations = set => {
    const durations = getDurations(set);
    return getPercentLossOfMetrics(durations);
};

export const getPercentLossOfPeakForces = set => {
    const peakForces = getPeakForces(set);
    return getPercentLossOfMetrics(peakForces);
};

export const getPercentLossOfAvgForces = set => {
    const averageForces = getAverageForces(set);
    return getPercentLossOfMetrics(averageForces);
};

export const getPercentLossOfPeakPowers = set => {
    const peakPowers = getPeakPowers(set);
    return getPercentLossOfMetrics(peakPowers);
};

export const getPercentLossOfAvgPowers = set => {
    const averagePowers = getAveragePowers(set);
    return getPercentLossOfMetrics(averagePowers);
};

export const getPercentLossOfLinear3DAvgVelocities = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getPercentLossOfMetrics(velocities);
};

export const getPercentLossOfLinear3DROMs = set => {
    const roms = getLinear3DROMs(set);
    return getPercentLossOfMetrics(roms);
};

export const getPercentLossOfPKHs = set => {
    const pkhs = getPKHs(set);
    return getPercentLossOfMetrics(pkhs);
};

export const getPercentLossOfPeakForceHeights = set => {
    const peakForceHeights = getPeakForceHeights(set);
    return getPercentLossOfMetrics(peakForceHeights);
};

export const getPercentLossOfPeakPowerHeights = set => {
    const peakPowerHeights = getPeakPowerHeights(set);
    return getPercentLossOfMetrics(peakPowerHeights);
};

export const getPercentLossOfWork = set => {
    const works = getWorks(set);
    return getPercentLossOfMetrics(works);
};
// First Rep Quantifiers

const getFirstRepOfMetrics = metrics => {
    if (metrics.length <= 0) {
        return null;
    }

    return Number(metrics[0].toFixed(2));
};

export const getFirstAvgVelocity = set => {
    const velocities = getAvgVelocities(set);
    return getFirstRepOfMetrics(velocities);
};

export const getFirstPKV = set => {
    const pkvs = getPKVs(set);
    return getFirstRepOfMetrics(pkvs);
};

export const getFirstPKH = set => {
    const pkhs = getPKHs(set);
    return getFirstRepOfMetrics(pkhs);
};

export const getFirstROM = set => {
    const roms = getROMs(set);
    return getFirstRepOfMetrics(roms);
};

export const getFirstDuration = set => {
    const durations = getDurations(set);
    return getFirstRepOfMetrics(durations);
};

export const getFirstPeakForce = set => {
    const peakForces = getPeakForces(set);
    return getFirstRepOfMetrics(peakForces);
};

export const getFirstPeakForceHeight = set => {
    const peakForceHeights = getPeakForceHeights(set);
    return getFirstRepOfMetrics(peakForceHeights);
};

export const getFirstAvgForce = set => {
    const averageForces = getAverageForces(set);
    return getFirstRepOfMetrics(averageForces);
};

export const getFirstPeakPower = set => {
    const peakPowers = getPeakPowers(set);
    return getFirstRepOfMetrics(peakPowers);
};

export const getFirstPeakPowerHeight = set => {
    const peakPowerHeights = getPeakPowerHeights(set);
    return getFirstRepOfMetrics(peakPowerHeights);
};

export const getFirstAvgPower = set => {
    const averagePowers = getAveragePowers(set);
    return getFirstRepOfMetrics(averagePowers);
};

export const getFirstLinear3DAvgVelocity = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getFirstRepOfMetrics(velocities);
};

export const getFirstLinear3DROM = set => {
    const roms = getLinear3DROMs(set);
    return getFirstRepOfMetrics(roms);
};

export const getFirstWork = set => {
    const works = getWorks(set);
    return getFirstRepOfMetrics(works);
};

// Last Rep Quantifiers

const getLastRepMetrics = metrics => {
    if (metrics.length <= 0) {
        return null;
    }

    return Number(metrics[metrics.length - 1].toFixed(2));
};

export const getLastAvgVelocity = set => {
    const velocities = getAvgVelocities(set);
    return getLastRepMetrics(velocities);
};

export const getLastPKV = set => {
    const pkvs = getPKVs(set);
    return getLastRepMetrics(pkvs);
};

export const getLastPKH = set => {
    const pkhs = getPKHs(set);
    return getLastRepMetrics(pkhs);
};

export const getLastROM = set => {
    const roms = getROMs(set);
    return getLastRepMetrics(roms);
};

export const getLastDuration = set => {
    const durations = getDurations(set);
    return getLastRepMetrics(durations);
};

export const getLastPeakForce = set => {
    const peakForces = getPeakForces(set);
    return getLastRepMetrics(peakForces);
};

export const getLastPeakForceHeight = set => {
    const peakForceHeights = getPeakForceHeights(set);
    return getLastRepMetrics(peakForceHeights);
};

export const getLastAvgForce = set => {
    const averageForces = getAverageForces(set);
    return getLastRepMetrics(averageForces);
};

export const getLastPeakPower = set => {
    const peakPowers = getPeakPowers(set);
    return getLastRepMetrics(peakPowers);
};

export const getLastPeakPowerHeight = set => {
    const peakPowerHeights = getPeakPowerHeights(set);
    return getLastRepMetrics(peakPowerHeights);
};

export const getLastAvgPower = set => {
    const averagePowers = getAveragePowers(set);
    return getLastRepMetrics(averagePowers);
};

export const getLastLinear3DAvgVelocity = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getLastRepMetrics(velocities);
};

export const getLastLinear3DROM = set => {
    const roms = getLinear3DROMs(set);
    return getLastRepMetrics(roms);
};

export const getLastWork = set => {
    const works = getWorks(set);
    return getLastRepMetrics(works);
};
// Get Min Quantifiers

const getMinMetrics = metrics => {
    if (metrics.length <= 0) {
        return null;
    }

    return Number(Math.min(...metrics).toFixed(2));
};

export const getMinAvgVelocity = set => {
    const velocities = getAvgVelocities(set);
    return getMinMetrics(velocities);
};

export const getMinPKV = set => {
    const pkvs = getPKVs(set);
    return getMinMetrics(pkvs);
};

export const getMinPKH = set => {
    const pkhs = getPKHs(set);
    return getMinMetrics(pkhs);
};

export const getMinROM = set => {
    const roms = getROMs(set);
    return getMinMetrics(roms);
};

export const getMinDuration = set => {
    const durations = getDurations(set);
    return getMinMetrics(durations);
};

export const getMinPeakForce = set => {
    const peakForces = getPeakForces(set);
    return getMinMetrics(peakForces);
};

export const getMinPeakForceHeight = set => {
    const peakForceHeights = getPeakForceHeights(set);
    return getMinMetrics(peakForceHeights);
};

export const getMinAvgForce = set => {
    const averageForces = getAverageForces(set);
    return getMinMetrics(averageForces);
};

export const getMinPeakPower = set => {
    const peakPowers = getPeakPowers(set);
    return getMinMetrics(peakPowers);
};

export const getMinPeakPowerHeight = set => {
    const peakPowerHeights = getPeakPowerHeights(set);
    return getMinMetrics(peakPowerHeights);
};

export const getMinAvgPower = set => {
    const averagePowers = getAveragePowers(set);
    return getMinMetrics(averagePowers);
};

export const getMinLinear3DAvgVelocity = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getMinMetrics(velocities);
};

export const getMinLinear3DROM = set => {
    const roms = getLinear3DROMs(set);
    return getMinMetrics(roms);
};

export const getMinWork = set => {
    const works = getWorks(set);
    return getMinMetrics(works);
};

// Get Max Quantifiers

const getMaxMetrics = metrics => {
    if (metrics.length <= 0) {
        return null;
    }

    return Number(Math.max(...metrics).toFixed(2));
};

export const getMaxAvgVelocity = set => {
    const velocities = getAvgVelocities(set);
    return getMaxMetrics(velocities);
};

export const getMaxPKV = set => {
    const pkvs = getPKVs(set);
    return getMaxMetrics(pkvs);
};

export const getMaxPKH = set => {
    const pkhs = getPKHs(set);
    return getMaxMetrics(pkhs);
};

export const getMaxROM = set => {
    const roms = getROMs(set);
    return getMaxMetrics(roms);
};

export const getMaxDuration = set => {
    const durations = getDurations(set);
    return getMaxMetrics(durations);
};

export const getMaxPeakForce = set => {
    const peakForces = getPeakForces(set);
    return getMaxMetrics(peakForces);
};

export const getMaxPeakForceHeight = set => {
    const peakForceHeights = getPeakForceHeights(set);
    return getMaxMetrics(peakForceHeights);
};

export const getMaxAvgForce = set => {
    const averageForces = getAverageForces(set);
    return getMaxMetrics(averageForces);
};

export const getMaxPeakPower = set => {
    const peakPowers = getPeakPowers(set);
    return getMaxMetrics(peakPowers);
};

export const getMaxPeakPowerHeight = set => {
    const peakPowerHeights = getPeakPowerHeights(set);
    return getMaxMetrics(peakPowerHeights);
};

export const getMaxAvgPower = set => {
    const averagePowers = getAveragePowers(set);
    return getMaxMetrics(averagePowers);
};

export const getMaxLinear3DAvgVelocity = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getMaxMetrics(velocities);
};

export const getMaxLinear3DROM = set => {
    const roms = getLinear3DROMs(set);
    return getMaxMetrics(roms);
};

export const getMaxWork = set => {
    const works = getWorks(set);
    return getMaxMetrics(works);
};
// Peak-End

const getPeakEndMetrics = metrics => {
    const min = getMinMetrics(metrics);
    const lastRepMetric = getLastRepMetrics(metrics);

    if (metrics.length > 0) {
        return Number(((lastRepMetric + min) / 2).toFixed(2));
    } else {
        return null;
    }
};

export const getPeakEndOfAvgVelocities = set => {
    const velocities = getAvgVelocities(set);
    return getPeakEndMetrics(velocities);
};

export const getPeakEndOfPKVs = set => {
    const pkvs = getPKVs(set);
    return getPeakEndMetrics(pkvs);
};

export const getPeakEndOfROMs = set => {
    const roms = getROMs(set);
    return getPeakEndMetrics(roms);
};

export const getPeakEndOfDurations = set => {
    const durations = getDurations(set);
    return getPeakEndMetrics(durations);
};

export const getPeakEndOfPeakForces = set => {
    const peakForces = getPeakForces(set);
    return getPeakEndMetrics(peakForces);
};

export const getPeakEndOfAvgForces = set => {
    const averageForces = getAverageForces(set);
    return getPeakEndMetrics(averageForces);
};

export const getPeakEndOfPeakPowers = set => {
    const peakPowers = getPeakPowers(set);
    return getPeakEndMetrics(peakPowers);
};

export const getPeakEndOfAvgPowers = set => {
    const averagePowers = getAveragePowers(set);
    return getPeakEndMetrics(averagePowers);
};

export const getPeakEndOfLinear3DAvgVelocities = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getPeakEndMetrics(velocities);
};

export const getPeakEndOfLinear3DROMs = set => {
    const roms = getLinear3DROMs(set);
    return getPeakEndMetrics(roms);
};

export const getPeakEndOfWork = set => {
    const works = getWorks(set);
    return getPeakEndMetrics(works);
};

// Set Loss

const getSetLossMetrics = metrics => {
    const lastRepMetric = getLastRepMetrics(metrics);
    const firstRepMetric = getFirstRepOfMetrics(metrics);

    if (metrics.length > 0) {
        return Number((lastRepMetric - firstRepMetric).toFixed(2));
    } else {
        return null;
    }
};

export const getSetLossOfAvgVelocities = set => {
    const velocities = getAvgVelocities(set);
    return getSetLossMetrics(velocities);
};

export const getSetLossOfPKVs = set => {
    const pkvs = getPKVs(set);
    return getSetLossMetrics(pkvs);
};

export const getSetLossOfROMs = set => {
    const roms = getROMs(set);
    return getSetLossMetrics(roms);
};

export const getSetLossOfDurations = set => {
    const durations = getDurations(set);
    return getSetLossMetrics(durations);
};

export const getSetLossOfPeakForces = set => {
    const peakForces = getPeakForces(set);
    return getSetLossMetrics(peakForces);
};

export const getSetLossOfAvgForces = set => {
    const averageForces = getAverageForces(set);
    return getSetLossMetrics(averageForces);
};

export const getSetLossOfPeakPowers = set => {
    const peakPowers = getPeakPowers(set);
    return getSetLossMetrics(peakPowers);
};

export const getSetLossOfAvgPowers = set => {
    const averagePowers = getAveragePowers(set);
    return getSetLossMetrics(averagePowers);
};

export const getSetLossOfLinear3DAvgVelocities = set => {
    const velocities = getLinear3DAvgVelocities(set);
    return getSetLossMetrics(velocities);
};

export const getSetLossOfLinear3DROMs = set => {
    const roms = getLinear3DROMs(set);
    return getSetLossMetrics(roms);
};

export const getSetLossOfWork = set => {
    const works = getWorks(set);
    return getSetLossMetrics(works);
};

// RPE 1RM

export const canCalcRPE1RM = set => {
    let rpe = set.rpe;
    if (!rpe) return false;

    const rpeWithoutCommas = rpe.replace(',', '.');
    if (isNaN(rpeWithoutCommas)) {
        return false;
    }

    if (
        rpeWithoutCommas === '6.5' ||
        rpeWithoutCommas === '7' ||
        rpeWithoutCommas === '7.5' ||
        rpeWithoutCommas === '8' ||
        rpeWithoutCommas === '8.5' ||
        rpeWithoutCommas === '9' ||
        rpeWithoutCommas === '9.5' ||
        rpeWithoutCommas === '10'
    ) {
        return true;
    }

    return false;
};

export const getRPE1RM = (set, useLBs = false) => {
    // empty rpe / weight check
    if (!set.rpe || !set.weight) {
        return null;
    }

    // rep length
    const numReps = SetUtils.numValidUnremovedReps(set);
    if (numReps <= 0 || numReps > 10) {
        return null;
    }

    if (useLBs) {
        var weight = SetUtils.weightInLBs(set);
    } else {
        var weight = set.weight;
    }
    const rpe = Number(set.rpe.replace(',', '.'));

    // RPE percentages of 1rm correlated to reps @ RPE values
    // "RPE":{"REP#": Percentage of 1rm, ...}
    const RPEIntensity = {
        10: {
            10: 0.759,
            9: 0.7855,
            8: 0.812,
            7: 0.839,
            6: 0.8665,
            5: 0.8935,
            4: 0.92,
            3: 0.947,
            2: 0.9735,
            1: 1,
        },
        9.5: {
            10: 0.7395,
            9: 0.765,
            8: 0.7915,
            7: 0.819,
            6: 0.8455,
            5: 0.872,
            4: 0.899,
            3: 0.9255,
            2: 0.9525,
            1: 0.98,
        },
        9: {
            10: 0.7195,
            9: 0.746,
            8: 0.7725,
            7: 0.7995,
            6: 0.8255,
            5: 0.8515,
            4: 0.878,
            3: 0.905,
            2: 0.9315,
            1: 0.959,
        },
        8.5: {
            10: 0.6985,
            9: 0.726,
            8: 0.753,
            7: 0.7795,
            6: 0.8065,
            5: 0.833,
            4: 0.8595,
            3: 0.886,
            2: 0.9115,
            1: 0.9385,
        },
        8: {
            10: 0.6775,
            9: 0.705,
            8: 0.732,
            7: 0.759,
            6: 0.7855,
            5: 0.8125,
            4: 0.839,
            3: 0.866,
            2: 0.893,
            1: 0.9195,
        },
        7.5: {
            10: 0.659,
            9: 0.684,
            8: 0.711,
            7: 0.7375,
            6: 0.7645,
            5: 0.792,
            4: 0.819,
            3: 0.8455,
            2: 0.872,
            1: 0.899,
        },
        7: {
            10: 0.639,
            9: 0.6655,
            8: 0.692,
            7: 0.719,
            6: 0.745,
            5: 0.771,
            4: 0.798,
            3: 0.825,
            2: 0.851,
            1: 0.878,
        },
        6.5: {
            10: 0.6185,
            9: 0.645,
            8: 0.6715,
            7: 0.6985,
            6: 0.7255,
            5: 0.7525,
            4: 0.779,
            3: 0.806,
            2: 0.832,
            1: 0.8575,
        },
        6: {
            10: 0.5975,
            9: 0.6245,
            8: 0.6515,
            7: 0.6785,
            6: 0.705,
            5: 0.7315,
            4: 0.7585,
            3: 0.7855,
            2: 0.812,
            1: 0.839,
        },
    };

    // rpe table lookup
    const rpeTable = RPEIntensity[rpe];
    if (!rpeTable) {
        return null;
    }

    // rpe percent lookup
    const rpePercent = rpeTable[numReps];
    if (!rpePercent) {
        return null;
    }

    // 1rm calculation by RPE percentage
    const result = weight / rpePercent;
    return Math.round(result);
};

// Best Ever

const getBestEverOfMetric = (set, allSets, metricFunction, isMax = true) => {
    // null if not enough data entered
    if (!isSetComparable(set)) {
        return null;
    }

    // find all instances of this exercise with weight and reps
    const matchedSets = allSets.filter(historySet =>
        areSetsComparable(historySet, set),
    );

    let metrics = matchedSets.map(matchedSet => {
        return metricFunction(matchedSet);
    });

    metrics = metrics.reduce((a, b) => a.concat(b), []);

    if (metrics.length > 0) {
        const result = isMax ? Math.max(...metrics) : Math.min(...metrics);
        return result ? Number(result).toFixed(2) : null;
    } else {
        return null;
    }
};

const areSetsComparable = (historySet, set) => {
    if (!isSetComparable(set)) {
        return false;
    }
    return (
        historySet.exercise === set.exercise &&
        historySet.weight === set.weight &&
        historySet.metric === set.metric
    );
};

const isSetComparable = set => {
    if (!set.exercise || set.exercise === '') {
        return false;
    }

    if (!set.weight || set.weight === '') {
        return false;
    }

    if (!set.metric || set.metric === '') {
        return false;
    }

    if (set.reps.length <= 0) {
        return false;
    }

    if (SetUtils.isDeleted(set)) {
        return false;
    }

    if (SetUtils.numValidUnremovedReps(set) <= 0) {
        return false;
    }

    return true;
};

export const getFastestAvgVelocityEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getAvgVelocities);
};

export const getFastestPKVEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getPKVs);
};

export const getFastestDurationEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getDurations, false);
};

export const getFastestLinear3DAvgVelocityEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getLinear3DAvgVelocities);
};

export const getSlowestAvgVelocityEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getAvgVelocities, false);
};

export const getSlowestPKVEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getPKVs, false);
};

export const getSlowestDurationEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getDurations);
};

export const getSlowestLinear3DAvgVelocityEver = (set, allSets) => {
    return getBestEverOfMetric(set, allSets, getLinear3DAvgVelocities, false);
};

// To String

export const metricAbbreviation = metric => {
    switch (metric) {
        case EMPTY_METRIC:
            return '';
        case AVG_VELOCITY_METRIC:
            return 'VEL';
        case RPE_METRIC:
            return 'RPE e1rm';
        case DURATION_METRIC:
            return 'DUR';
        case ROM_METRIC:
            return 'ROM';
        case PKH_METRIC:
            return 'PK VEL LOC';
        case PKV_METRIC:
            return 'PK VEL';
        case FORCE_METRIC:
            return 'FRC';
        case FORCE_HEIGHT_METRIC:
            return 'FH';
        case POWER_METRIC:
            return 'PWR';
        case POWER_HEIGHT_METRIC:
            return 'PH';
        case LINEAR_3D_AVG_VELOCITY_METRIC:
            return 'VEL³';
        case LINEAR_3D_ROM_METRIC:
            return 'ROM³';
        case WORK_METRIC:
            return 'WRK';
        default:
            return null;
    }
};

export const metricString = metric => {
    switch (metric) {
        case EMPTY_METRIC:
            return '';
        case AVG_VELOCITY_METRIC:
            return 'Average Velocity';
        case RPE_METRIC:
            return 'RPE';
        case DURATION_METRIC:
            return 'Duration';
        case ROM_METRIC:
            return 'Range Of Motion';
        case PKH_METRIC:
            return 'Peak Height';
        case PKV_METRIC:
            return 'Peak Velocity';
        case FORCE_METRIC:
            return 'Force';
        case FORCE_HEIGHT_METRIC:
            return 'Force Height';
        case POWER_METRIC:
            return 'Power';
        case POWER_HEIGHT_METRIC:
            return 'Power Height';
        case LINEAR_3D_AVG_VELOCITY_METRIC:
            return 'Average Velocity 3D';
        case LINEAR_3D_ROM_METRIC:
            return 'Range Of Motion 3D';
        case WORK_METRIC:
            return 'Work';
        case WORK_LOCATION_METRIC:
            return 'Work Location';
        case FORCE_LOCATION_METRIC:
            return 'Force Location';
        case POWER_LOCATION_METRIC:
            return 'Power Location';
        default:
            return null;
    }
};

export const metricUnit = (metric, quantifier) => {
    // some quantifiers override the units
    if (quantifier === PERCENT_LOSS_QUANTIFIER) {
        return '%';
    }

    switch (metric) {
        case EMPTY_METRIC:
            return '';
        case AVG_VELOCITY_METRIC:
        case LINEAR_3D_AVG_VELOCITY_METRIC:
        case PKV_METRIC:
            return 'm/s';
        case DURATION_METRIC:
            return 'sec';
        case LINEAR_3D_ROM_METRIC:
        case ROM_METRIC:
            return 'mm';
        case PKH_METRIC:
        case FORCE_HEIGHT_METRIC:
        case POWER_HEIGHT_METRIC:
            return '%';
        case FORCE_METRIC:
            return 'lb-f';
        case POWER_METRIC:
            return 'W';
        default:
            return null;
    }
};

export const quantifierAbbreviation = quantifier => {
    switch (quantifier) {
        case EMPTY_QUANTIFIER:
            return '';
        case FIRST_REP_QUANTIFIER:
            return 'FRST';
        case LAST_REP_QUANTIFIER:
            return 'LAST';
        case MIN_QUANTIFIER:
            return 'MIN';
        case MAX_QUANTIFIER:
            return 'MAX';
        case AVG_QUANTIFIER:
            return 'MEAN';
        case ABS_LOSS_QUANTIFIER:
            return 'ABS LOSS';
        case PERCENT_LOSS_QUANTIFIER:
            return 'PCT LOSS';
        case MAX_EVER_QUANTIFIER:
            return 'MAXPR';
        case MIN_EVER_QUANTIFIER:
            return 'MINPR';
        case SET_LOSS_QUANTIFIER:
            return 'SET LOSS';
        case PEAK_END_QUANTIFIER:
            return 'PEAK END';
        case PEAK_FORCE_METRIC:
            return 'PK FRC';
        case PEAK_POWER_METRIC:
            return 'PK PWR';
        case PEAK_FORCE_HEIGHT_METRIC:
            return 'PK HFRC';
        case PEAK_POWER_HEIGHT_METRIC:
            return 'PK HPWR';
        default:
            return null;
    }
};

export const quantifierString = quantifier => {
    switch (quantifier) {
        case EMPTY_QUANTIFIER:
            return '';
        case FIRST_REP_QUANTIFIER:
            return 'First Rep';
        case LAST_REP_QUANTIFIER:
            return 'Last Rep';
        case MIN_QUANTIFIER:
            return 'Minimum Set';
        case MAX_QUANTIFIER:
            return 'Maximum Set';
        case AVG_QUANTIFIER:
            return 'Average Set';
        case ABS_LOSS_QUANTIFIER:
            return 'Absolute Loss';
        case PERCENT_LOSS_QUANTIFIER:
            return 'Percent Loss';
        case MAX_EVER_QUANTIFIER:
            return 'Maximum Ever';
        case MIN_EVER_QUANTIFIER:
            return 'Minimum Ever';
        case SET_LOSS_QUANTIFIER:
            return 'Set Loss';
        case PEAK_END_QUANTIFIER:
            return 'Peak-End';
        default:
            return null;
    }
};

export const getPhaseString = phase => {
    switch (phase) {
        case ECCENTRIC:
            return 'Eccentric';
        case CONCENTRIC:
            return 'Concentric';
        default:
            return null;
    }
};

export const phaseAbbreviation = phase => {
    switch (phase) {
        case ECCENTRIC:
            return 'ECC';
        case CONCENTRIC:
            return 'CON';
        default:
            return null;
    }
};
