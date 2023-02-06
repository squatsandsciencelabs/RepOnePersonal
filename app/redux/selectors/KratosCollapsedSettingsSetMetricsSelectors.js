const stateRoot = state => state.kratosCollapsedSettingsSetMetrics;

export const getCurrentKratosCollapsedMetricRank = state =>
    stateRoot(state).currentKratosCollapsedMetricRank;

export const getIsEditingMetric = state => stateRoot(state).isEditingMetric;

export const getIsEditingRollup = state => stateRoot(state).isEditingRollup;

export const getIsEditingPhase = state => stateRoot(state).isEditingPhase;

export const getCurrentKratosMetric = state => {
    const root = stateRoot(state);
    switch (root.currentKratosCollapsedMetricRank) {
        case 1:
            return root.metric1;
        case 2:
            return root.metric2;
        case 3:
            return root.metric3;
        case 4:
            return root.metric4;
        case 5:
            return root.metric5;
        default:
            return null;
    }
};

export const getKratosMetricByRank = (state, rank) => {
    const root = stateRoot(state);
    switch (rank) {
        case 1:
            return root.metric1;
        case 2:
            return root.metric2;
        case 3:
            return root.metric3;
        case 4:
            return root.metric4;
        case 5:
            return root.metric5;
        default:
            return null;
    }
};

export const getCurrentKratosRollup = state => {
    const root = stateRoot(state);
    switch (root.currentKratosCollapsedMetricRank) {
        case 1:
            return root.rollup1;
        case 2:
            return root.rollup2;
        case 3:
            return root.rollup3;
        case 4:
            return root.rollup4;
        case 5:
            return root.rollup5;
        default:
            return null;
    }
};

export const getKratosRollupByRank = (state, rank) => {
    const root = stateRoot(state);
    switch (rank) {
        case 1:
            return root.rollup1;
        case 2:
            return root.rollup2;
        case 3:
            return root.rollup3;
        case 4:
            return root.rollup4;
        case 5:
            return root.rollup5;
        default:
            return null;
    }
};

export const getCurrentKratosPhase = state => {
    const root = stateRoot(state);
    switch (root.currentKratosCollapsedMetricRank) {
        case 1:
            return root.phase1;
        case 2:
            return root.phase2;
        case 3:
            return root.phase3;
        case 4:
            return root.phase4;
        case 5:
            return root.phase5;
        default:
            return null;
    }
};

export const getKratosPhaseByRank = (state, rank) => {
    const root = stateRoot(state);
    return root[`phase${rank}`] || null;
};
