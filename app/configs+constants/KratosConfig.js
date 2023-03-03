import firebase from 'app/services/Firebase';
import * as WeightConversion from 'app/utility/WeightConversion';

export const DEFAULT_KRATOS_AUTO_DELETE_REPS = 1;

export const getKratosEnabled = () =>
    firebase.remoteConfig().getValue('kratos_enabled').asBoolean();

export const kratosDiscWeights = {
    XS: 2.65,
    S: 4.16,
    M: 5.88,
    L: 8.3,
    XL: 11.94,
};

export const getKratosDiscMass = disc => {
    return WeightConversion.weightInKGs('lbs', kratosDiscWeights[disc]);
};

export const kratosDiscsOptions = [
    { key: 'XS', fullName: 'Extra Small', description: '2.65lbs' },
    { key: 'S', fullName: 'Small', description: '4.16lbs' },
    { key: 'M', fullName: 'Medium', description: '5.88lbs' },
    { key: 'L', fullName: 'Large', description: '8.3lbs' },
    { key: 'XL', fullName: 'Extra Large', description: '11.94lbs' },
];
