import firebase from 'app/services/Firebase';

export var kratosEnabled = firebase
    .remoteConfig()
    .getValue('kratos_enabled')
    .asBoolean();

export const setKratosEnabled = value => {
    kratosEnabled = value;
};
