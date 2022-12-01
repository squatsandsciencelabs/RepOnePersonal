import firebase from 'app/services/Firebase';

export const getKratosEnabled = () =>
    firebase.remoteConfig().getValue('kratos_enabled').asBoolean();
