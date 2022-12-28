import { takeEvery, select, put, all } from 'redux-saga/effects';
import {
    CONNECTED_TO_DEVICE,
    END_SET,
    SET_DEVICE_TYPE,
} from 'app/configs+constants/ActionTypes';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as ConnectedDeviceStatusSelectors from 'app/redux/selectors/ConnectedDeviceStatusSelectors';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';
import { getDeviceType } from 'app/utility/SensorUtils';

export default function* WorkingSetDeviceSaga() {
    yield all([
        takeEvery(CONNECTED_TO_DEVICE, connectedToDevice),
        takeEvery(END_SET, endSet),
    ]);
}

function* connectedToDevice(action) {
    const workingSet = yield select(SetsSelectors.getWorkingSet);
    const deviceType = getKratosEnabled()
        ? getDeviceType(action.deviceName)
        : 'RepOne';

    if (deviceType !== workingSet.deviceType && workingSet.reps.length > 0) {
        const state = yield select();
        const defaultMetric = state.settings.defaultMetric;

        yield put({
            type: END_SET,
            defaultMetric,
        });
    }
}

function* endSet(action) {
    const device = yield select(
        ConnectedDeviceStatusSelectors.getConnectedDeviceName,
    );

    yield put({ type: SET_DEVICE_TYPE, deviceName: device ?? 'RepOne' });
}
