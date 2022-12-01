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
import * as Analytics from 'app/services/Analytics';

export default function * FetchConfigSaga() {
    yield all([
        takeEvery(STORE_INITIALIZED, fetchConfig),
    ]);
};

function* fetchConfig() {
    try {
        const fbconfig = firebase.remoteConfig();

        // Set default values
        yield apply(fbconfig, fbconfig.setDefaults, [
            { survey_url: '', kratos_enabled: false },
        ]);

        // initial fetch
        yield apply(fbconfig, fbconfig.fetch, [0]); // USE THIS INSTEAD FOR DEBUGGING AS IT REFRESHES INSTANTLY
        const activated = yield apply(fbconfig, fbconfig.activate);
        yield put({
            type: CONFIG_READY,
            activated,
        });
    } catch (error) {
        console.tron.log(`error fetching config on startup ${error}`);
        logInitSurveyURLErrorAnalytics(error);
    }
}

const logInitSurveyURLErrorAnalytics = (error) => {
    Analytics.logError(error, 'init_survey_url_error', {});
};
