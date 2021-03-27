import {
    takeEvery,
    put,
    apply,
    all,
    call,
    select,
} from 'redux-saga/effects';

import { 
    STORE_INITIALIZED,
    CONFIG_READY,
} from 'app/configs+constants/ActionTypes';
import firebase from 'app/services/Firebase';

export default function * FetchConfigSaga() {
    yield all([
        takeEvery(STORE_INITIALIZED, fetchConfig),
    ]);
};

function* fetchConfig() {
    try {
        const fbconfig = firebase.remoteConfig();
        yield apply(fbconfig, fbconfig.fetch, [0]); // USE THIS INSTEAD FOR DEBUGGING AS IT REFRESHES INSTANTLY
        const activated = yield apply(fbconfig, fbconfig.activateFetched);
        yield put({
            type: CONFIG_READY,
            activated,
        });
    } catch (error) {
        console.tron.log(`error fetching config on startup ${error}`);
    }
}
