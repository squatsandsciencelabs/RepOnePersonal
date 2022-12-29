import firebase from 'app/services/Firebase';

export const getKratosEnabled = () =>
    firebase.remoteConfig().getValue('kratos_enabled').asBoolean();

export const KratosDiscSizes = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
};

export const KratosDiscFullNames = {
    XS: 'Extra Small',
    S: 'Small',
    M: 'Medium',
    L: 'Large',
    XL: 'Extra Large',
};
