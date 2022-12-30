// These exist as a shared action creator because saving values can be done from all over the app

import {
    SAVE_END_SET_TIMER,
    SAVE_DEFAULT_METRIC,
    UPDATE_SYNC_DATE,
    SAVE_KRATOS_AUTO_DELETE_REPS,
} from 'app/configs+constants/ActionTypes';
import { DEFAULT_KRATOS_AUTO_DELETE_REPS } from 'app/configs+constants/KratosConfig';

export const saveDefaultMetric = (metric = 'kgs') => ({
    type: SAVE_DEFAULT_METRIC,
    defaultMetric: metric,
});

export const saveEndSetTimer = (duration = 30) => ({
    type: SAVE_END_SET_TIMER,
    endSetTimerDuration: duration,
});

export const saveKratosAutoDeleteReps = (
    autoDeleteReps = DEFAULT_KRATOS_AUTO_DELETE_REPS,
) => ({
    type: SAVE_KRATOS_AUTO_DELETE_REPS,
    autoDeleteReps,
});

export const updateSyncDate = (syncDate = new Date()) => ({
    type: UPDATE_SYNC_DATE,
    syncDate: syncDate,
});
