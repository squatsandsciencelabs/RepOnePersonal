const stateRoot = (state) => state.scalar;

export const getStartPoints = (state) => {
    return stateRoot(state).start;
};

export const getEndPoints = (state) => {
    return stateRoot(state).end;
};

export const getResults = (state) => {
    return stateRoot(state).results;
};
