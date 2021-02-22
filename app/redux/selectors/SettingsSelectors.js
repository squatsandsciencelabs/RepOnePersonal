const stateRoot = (state) => state.settings;

export const getIsEditingDefaultMetric = (state) => stateRoot(state).isEditingDefaultMetric;

export const getDefaultMetric = (state) => stateRoot(state).defaultMetric;

export const getIsEditingEndSetTimer = (state) => stateRoot(state).isEditingEndSetTimer;

export const getEndSetTimerDuration = (state) => stateRoot(state).endSetTimerDuration;

export const getIfTimerWasEdited = (state) => stateRoot(state).wasTimerEdited;

export const getIsExportingCSV = (state) => stateRoot(state).isExportingCSV;

// not memoizing as this is for analytics and needs to be real time
export const getEndSetTimeLeft = (state) => {
    const endSetTimerDuration = getEndSetTimerDuration(state);
    const currentTime = Date.now();
    return Math.abs(endSetTimerDuration - currentTime);
}

export const getLastExportCSVDate = (state) => stateRoot(state).lastExportCSVDate;

export const getVelocityThreshold = (state) => stateRoot(state).velocityThreshold;

export const getIsShowingVisualization = state => stateRoot(state).isShowingVisualization;
