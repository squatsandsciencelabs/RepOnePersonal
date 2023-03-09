const stateRoot = state => state.workoutCollapsed;

export const getIsCollapsed = (state, setID) => {
    return stateRoot(state)[setID] !== false;
};

export const getCollapsedModel = state => stateRoot(state);
