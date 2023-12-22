import firebase from 'app/services/Firebase';

export const DEFAULT_KRATOS_AUTO_DELETE_REPS = 1;

export const getKratosEnabled = () => true;

export const kratosDiscsOptions = [
    { key: 'XS', fullName: 'Extra Small', description: '2.65lbs' },
    { key: 'S', fullName: 'Small', description: '4.16lbs' },
    { key: 'M', fullName: 'Medium', description: '5.88lbs' },
    { key: 'L', fullName: 'Large', description: '8.3lbs' },
    { key: 'XL', fullName: 'Extra Large', description: '11.94lbs' },
];
