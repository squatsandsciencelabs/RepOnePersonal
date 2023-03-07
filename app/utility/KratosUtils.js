import * as WeightConversion from 'app/utility/WeightConversion';

export const kratosDiscWeights = {
    XS: 2.65,
    S: 4.16,
    M: 5.88,
    L: 8.3,
    XL: 11.94,
};

export const getTotalKratosDiscsWeights = kratosDiscs => {
    if (!kratosDiscs) {
        return null;
    }

    return Object.entries(kratosDiscs)
        .filter(disc => !!disc[1])
        .map(disc => kratosDiscWeights[disc[0]] * disc[1])
        .reduce((acc, disc) => acc + disc, 0);
};

export const getTotalKratosDiscsMass = kratosDiscs => {
    const sum = getTotalKratosDiscsWeights(kratosDiscs);

    return sum === 0 || sum === null
        ? null
        : WeightConversion.weightInKGs('lbs', sum);
};
