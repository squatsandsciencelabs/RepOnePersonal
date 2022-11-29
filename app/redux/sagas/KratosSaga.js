import { takeEvery, apply, all, call, select } from 'redux-saga/effects';

import { CONFIG_READY, CHANGE_TAB } from 'app/configs+constants/ActionTypes';
import firebase from 'app/services/Firebase';
import * as Analytics from 'app/services/Analytics';
import { setKratosEnabled } from 'app/configs+constants/KratosConfig';

var configReady = false;

const KratosSaga = function* KratosSaga() {
    yield all([
        takeEvery(CONFIG_READY, onConfigReady),
        takeEvery(CHANGE_TAB, fetchAndUpdateKratosEnabled),
    ]);
};

function* onConfigReady() {
    configReady = true;
    yield call(updateKratosEnabled);
}

function* fetchAndUpdateKratosEnabled() {
    if (!configReady) {
        console.tron.log(
            `Сannot fetch and update kratos enabled value as config isn't ready yet`,
        );
        return;
    }

    const fbconfig = firebase.remoteConfig();

    try {
        // fetch and activate
        const activated = yield apply(fbconfig, fbconfig.fetchAndActivate);

        if (!activated) {
            console.tron.log('Fetched data not activated');
            return;
        }

        yield call(updateKratosEnabled);
    } catch (error) {
        const state = yield select();
        logUpdateKratosEnabledErrorAnalytics(state, error);
    }
}

function* updateKratosEnabled() {
    if (!configReady) {
        console.tron.log(
            `cannot update kratos enabled value as config isn't ready yet`,
        );
    }

    const fbconfig = firebase.remoteConfig();
    let state = null;

    try {
        // get kratos_enabled
        const kratos_enabled = fbconfig.getValue('kratos_enabled').asBoolean();

        state = yield select();
        logUpdateKratosEnabledAnalytics(state, kratos_enabled);

        yield call(updateKratosEnabledValue, kratos_enabled);
    } catch (error) {
        if (state === null) {
            state = yield select();
        }

        logUpdateKratosEnabledErrorAnalytics(state, error);
    }
}

const logUpdateKratosEnabledErrorAnalytics = (state, error) => {
    Analytics.logErrorWithAppState(
        error,
        'update_kratos_enabled_error',
        {},
        state,
    );
};

const logUpdateKratosEnabledAnalytics = (state, kratos_enabled) => {
    Analytics.logEventWithAppState(
        'update_kratos_enabled',
        {
            kratos_enabled,
        },
        state,
    );
};

const updateKratosEnabledValue = value => {
    setKratosEnabled(value);
};

export default KratosSaga;
