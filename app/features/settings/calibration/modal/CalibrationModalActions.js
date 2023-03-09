import {
    START_CALIBRATION,
    FINISH_CALIBRATION,
    CANCEL_CALIBRATION,
} from 'app/configs+constants/ActionTypes';

export const startCalibration = () => ({
    type: START_CALIBRATION,
});

export const finishCalibration = () => ({
    type: FINISH_CALIBRATION,
});

export const cancelCalibration = () => ({
    type: CANCEL_CALIBRATION,
});
