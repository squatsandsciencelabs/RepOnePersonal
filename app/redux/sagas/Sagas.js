import { all } from 'redux-saga/effects';

import KillSwitchSaga from './KillSwitchSaga';
import InitConfigSaga from './InitConfigSaga';
import TokenSaga from './TokenSaga';
import AuthSaga from './AuthSaga';
import BluetoothSaga from './BluetoothSaga';
import SuggestionsSaga from './SuggestionsSaga';
import SyncSaga from './SyncSaga';
import TimerSaga from './TimerSaga';
import TimerUnlockSaga from './TimerUnlockSaga';
import EndOldWorkoutSaga from './EndOldWorkoutSaga';
import ReconnectSaga from './ReconnectSaga';
import SurveySaga from './SurveySaga';
import InitializedAnalyticsSaga from './InitializedAnalyticsSaga';
import OneRMAnalyticsSaga from './OneRMAnalyticsSaga';
// import VelocityThresholdSaga from './VelocityThresholdSaga';
import OTASaga from './OTASaga';
import BulkDataSaga from './BulkDataSaga';
import CalibrationSaga from './CalibrationSaga';
import ScalarSaga from './ScalarSaga';
import WorkingSetDeviceSaga from './WorkingSetDeviceSaga';

const Sagas = function* Sagas(dispatch) {
    yield all([
        KillSwitchSaga(),
        InitConfigSaga(),
        TokenSaga(),
        AuthSaga(),
        BluetoothSaga(),
        SuggestionsSaga(),
        SyncSaga(),
        TimerSaga(),
        TimerUnlockSaga(),
        EndOldWorkoutSaga(),
        ReconnectSaga(),
        SurveySaga(),
        InitializedAnalyticsSaga(),
        OneRMAnalyticsSaga(),
        OTASaga(dispatch),
        BulkDataSaga(),
        CalibrationSaga(),
        ScalarSaga(),
        WorkingSetDeviceSaga(),
        // VelocityThresholdSaga(),
    ]);
};

export default Sagas;
