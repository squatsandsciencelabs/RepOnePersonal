const stateRoot = (state) => state.calibration;

export const getIsModalShowing = state => stateRoot(state).mode !== 'CLOSED';

export const getStep = state => {
    const mode = stateRoot(state).mode;
    if (mode === 'INSTRUCTIONS') {
        return 1;
    } else if (mode === 'CALIBRATING') {
        return 2;
    }

    return 0;
};

export const getIsCancelEnabled = state => {
    return stateRoot(state).mode === 'INSTRUCTIONS';
};
