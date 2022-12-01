import { takeEvery, apply, all, call, select } from 'redux-saga/effects';

import { CONFIG_READY, CHANGE_TAB } from 'app/configs+constants/ActionTypes';
import firebase from 'app/services/Firebase';
import * as Analytics from 'app/services/Analytics';

var configReady = false;

const KratosSaga = function* KratosSaga() {
    yield all([
        takeEvery(CONFIG_READY, onConfigReady),
        takeEvery(CHANGE_TAB, fetchKratosEnabled),
    ]);
};

function* onConfigReady() {
    configReady = true;
}

function* fetchKratosEnabled() {
    if (!configReady) {
        console.tron.log(
            `Сannot fetch and update kratos enabled value as config isn't ready yet`,
        );
        return;
    }

    const fbconfig = firebase.remoteConfig();
    let state = null;

    try {
        // fetch and activate
        const activated = yield apply(fbconfig, fbconfig.fetchAndActivate);

        if (!activated) {
            console.tron.log('Fetched data not activated');
        }

        const kratos_enabled = fbconfig.getValue('kratos_enabled').asBoolean();

        state = yield select();
        logFetchKratosEnabledAnalytics(state, kratos_enabled);
    } catch (error) {
        state = yield select();
        logFetchKratosEnabledErrorAnalytics(state, error);
    }
}

const logFetchKratosEnabledErrorAnalytics = (state, error) => {
    Analytics.logErrorWithAppState(
        error,
        'update_kratos_enabled_error',
        {},
        state,
    );
};

const logFetchKratosEnabledAnalytics = (state, kratos_enabled) => {
    Analytics.logEventWithAppState(
        'update_kratos_enabled',
        {
            kratos_enabled,
        },
        state,
    );
};

export default KratosSaga;
