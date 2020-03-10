const stateRoot = (state) => state.bulkData;

export const getTotalSampleCount = (state, deviceRepID) => {
    return stateRoot(state)[deviceRepID] ? stateRoot(state)[deviceRepID].totalSampleCount : null;
};

export const areAllSamplesReceived = (state, deviceRepID) => {
    if (!stateRoot(state)[deviceRepID] || stateRoot(state)[deviceRepID].totalSampleCount === null || stateRoot(state)[deviceRepID].totalSampleCount > stateRoot(state)[deviceRepID].receivedSampleCount) {
        return false;
    }
    return true;
};

export const getRepBulkData = (state, deviceRepID) => {
    return stateRoot(state)[deviceRepID].bulk;
};

export const getRepIndex = (state, deviceRepID) => {
    return stateRoot(state)[deviceRepID].repIndex;
}; 

export const getSetID = (state, deviceRepID) => {
    return stateRoot(state)[deviceRepID].setID;
};
