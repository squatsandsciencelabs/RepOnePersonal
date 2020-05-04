import {
    SHOW_CALIBRATION_MODAL,
    RESET_CALIBRATION,
} from 'app/configs+constants/ActionTypes';

export const tappedCalibrate = () => ({ 
    type: SHOW_CALIBRATION_MODAL,
});

export const tappedReset = () => ({
    type: RESET_CALIBRATION,
});
