import {
    SHOW_CALIBRATION_MODAL,
    START_CALIBRATION,
    CANCEL_CALIBRATION,
    FINISH_CALIBRATION,
} from 'app/configs+constants/ActionTypes';
import {
    INSTRUCTIONS,
    CALIBRATING,
    CLOSED,
} from 'app/configs+constants/CalibrationModeTypes';

const defaultState = {
    mode: CLOSED,
};

const CalibrationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SHOW_CALIBRATION_MODAL:
            return {
                ...state,
                mode: INSTRUCTIONS,
            };
        case START_CALIBRATION:
            return {
                ...state,
                mode: CALIBRATING,
            };
        case CANCEL_CALIBRATION: // a disconnect should cause the saga to send this too
        case FINISH_CALIBRATION:
            return {
                ...state,
                mode: CLOSED,
            };
        default:
            return state;
    }
};

export default CalibrationReducer;
