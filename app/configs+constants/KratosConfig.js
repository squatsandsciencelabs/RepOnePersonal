import firebase from 'app/services/Firebase';

export const getKratosEnabled = () =>
    firebase.remoteConfig().getValue('kratos_enabled').asBoolean();

export const kratosDiscsOptions = [
    { key: 'XS', fullName: 'Extra Small', description: '2.65lbs' },
    { key: 'S', fullName: 'Small', description: '4.16lbs', },
    { key: 'M', fullName: 'Medium', description: '5.88lbs', },
    { key: 'L', fullName: 'Large', description: '8.3lbs', },
    { key: 'XL', fullName: 'Extra Large', description: '11.94lbs', },
];