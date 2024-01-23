import * as WeightConversion from 'app/utility/WeightConversion';

export const kratosDiscWeights = {
    XS: 2.65,
    S: 4.16,
    M: 5.88,
    L: 8.3,
    XL: 11.94,
};

export const kratosDiscInertialConstants = {
    SHAFT: 0.001,
    XS: 0.003171364625,
    S: 0.007476443,
    M: 0.01273424873,
    L: 0.029741352,
    XL: 0.061672442,
};

export const getTotalKratosDiscsWeights = kratosDiscs => {
    if (!kratosDiscs) {
        return null;
    }

    return (
        Object.entries(kratosDiscs)
            .filter(disc => !!disc[1])
            // The Kratos disk object consists of a key (disk type) and a value (number of disks), e.g. { S: 2, M: 1 }
            // Calculate the weight of each disk by multiplying the weight by the number of disks
            .map(disc => kratosDiscWeights[disc[0]] * disc[1])
            .reduce((acc, disc) => acc + disc, 0)
    );
};

export const getTotalKratosDiscsMass = kratosDiscs => {
    const sum = getTotalKratosDiscsWeights(kratosDiscs);

    return sum === 0 || sum === null
        ? null
        : WeightConversion.weightInKGs('lbs', sum);
};

export const getTotalKratosDiscsInertialConstant = kratosDiscs => {
    if (!kratosDiscs) {
        return null;
    }

    return (
        Object.entries(kratosDiscs)
            .filter(disc => !!disc[1])
            // The Kratos disk object consists of a key (disk type) and a value (number of disks), e.g. { S: 2, M: 1 }
            // Calculate the total inertial constant of each disk by multiplying the inertial constant by the number of disks
            .map(disc => kratosDiscInertialConstants[disc[0]] * disc[1])
            .reduce(
                (acc, disc) => acc + disc,
                kratosDiscInertialConstants.SHAFT,
            )
    );
};
