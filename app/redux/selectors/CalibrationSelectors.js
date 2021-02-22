import { createSelector } from 'reselect';
import { INSTRUCTIONS, CALIBRATING, CLOSED } from 'app/configs+constants/CalibrationModeTypes';

const stateRoot = (state) => state.calibration;

export const getMode = state => stateRoot(state).mode;

export const getIsModalShowing = state => getMode(state) !== CLOSED;

// memoization is debatable here, but should be some gain for minor loss
export const getStep = createSelector(
    getMode,
    mode => {
        if (mode === INSTRUCTIONS) {
            return 1;
        } else if (mode === CALIBRATING) {
            return 2;
        }
    
        return 0;
    }
);

export const getIsCancelEnabled = state => {
    return getMode(state) === INSTRUCTIONS;
};
