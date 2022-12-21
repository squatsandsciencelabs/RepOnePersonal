import {
    take,
    takeEvery,
    select,
    put,
    call,
    all,
    apply,
} from 'redux-saga/effects';
import {
    CONNECTED_TO_DEVICE,
    DISCONNECTED_FROM_DEVICE,
    END_SET,
    ADD_REP_DATA,
    ADD_KRATOS_REP_DATA,
} from 'app/configs+constants/ActionTypes';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

export default function* SetsSaga() {
    yield all([
        takeEvery(CONNECTED_TO_DEVICE, connectedToDevice),
        takeEvery(DISCONNECTED_FROM_DEVICE, disconnectedFromDevice),
        takeEvery(ADD_REP_DATA, addRepData),
        takeEvery(ADD_KRATOS_REP_DATA, addKratosRepData),
    ]);
};

function* connectedToDevice(action) {
    const workingSet = yield select(SetsSelectors.getWorkingSet);
    // TODO: specify deviceType based on deviceName and then compare
    // TODO: check if workingSet has deviceType?
    if (action.deviceName !== workingSet.deviceType) {
        // TODO: also check for reps deviceFamily?
        // TODO: add case for end_set
        const state = yield select();
        const defaultMetric = state.settings.defaultMetric;
        console.log(
            'state.settings.defaultMetric',
            state.settings.defaultMetric,
        );
        // ! use getConnectedDeviceName
        yield put({
            type: END_SET,
            defaultMetric,
        });
    }
}

function* disconnectedFromDevice(action) {}

function* addRepData(action) {}

function* addKratosRepData(action) {}
