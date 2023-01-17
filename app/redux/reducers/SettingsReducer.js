import {
    SAVE_END_SET_TIMER,
    PRESENT_END_SET_TIMER,
    DISMISS_END_SET_TIMER,
    LOGIN_SUCCESS,
    UPDATE_SET_DATA_FROM_SERVER,
    SAVE_DEFAULT_METRIC,
    PRESENT_DEFAULT_METRIC,
    DISMISS_DEFAULT_METRIC,
    UPDATE_SYNC_DATE,
    EXPORTING_CSV,
    SAVE_KRATOS_AUTO_DELETE_REPS,
    PRESENT_KRATOS_AUTO_DELETE_REPS,
    DISMISS_KRATOS_AUTO_DELETE_REPS,
} from 'app/configs+constants/ActionTypes';
import { DEFAULT_KRATOS_AUTO_DELETE_REPS } from 'app/configs+constants/KratosConfig';

const defaultState = {
    defaultMetric: 'kgs',
    isEditingDefaultMetric: false,
    endSetTimerDuration: 30,
    isEditingEndSetTimer: false,
    kratosAutoDeleteRepCount: DEFAULT_KRATOS_AUTO_DELETE_REPS,
    isEditingKratosAutoDeleteReps: false,
    syncDate: '',
    wasTimerEdited: false,
    wasMetricEdited: false,
    isExportingCSV: false,
    lastExportCSVDate: null,
    velocityThreshold: 0.1,
    isShowingVisualization: false,
};

const SettingsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SAVE_DEFAULT_METRIC:
            return Object.assign({}, state, {
                defaultMetric: action.defaultMetric,
            });
        case PRESENT_DEFAULT_METRIC:
            return Object.assign({}, state, {
                isEditingDefaultMetric: true,
            });
        case DISMISS_DEFAULT_METRIC:
            return Object.assign({}, state, {
                isEditingDefaultMetric: false,
            });
        case SAVE_END_SET_TIMER:
            return Object.assign({}, state, {
                endSetTimerDuration: action.endSetTimerDuration,
                wasTimerEdited: true,
            });
        case PRESENT_END_SET_TIMER:
            return Object.assign({}, state, {
                isEditingEndSetTimer: true,
            });
        case DISMISS_END_SET_TIMER:
            return Object.assign({}, state, {
                isEditingEndSetTimer: false,
            });
        case SAVE_KRATOS_AUTO_DELETE_REPS:
            return Object.assign({}, state, {
                kratosAutoDeleteRepCount: action.autoDeleteReps,
            });
        case PRESENT_KRATOS_AUTO_DELETE_REPS:
            return Object.assign({}, state, {
                isEditingKratosAutoDeleteReps: true,
            });
        case DISMISS_KRATOS_AUTO_DELETE_REPS:
            return Object.assign({}, state, {
                isEditingKratosAutoDeleteReps: false,
            });
        case UPDATE_SET_DATA_FROM_SERVER:
        case LOGIN_SUCCESS:
        case UPDATE_SYNC_DATE:
            return Object.assign({}, state, {
                syncDate: action.syncDate,
            });
        case EXPORTING_CSV:
            return Object.assign({}, state, {
                isExportingCSV: action.isExportingCSV,
                lastExportCSVDate: new Date(),
            });
        default:
            return state;
    }
};

export default SettingsReducer;
