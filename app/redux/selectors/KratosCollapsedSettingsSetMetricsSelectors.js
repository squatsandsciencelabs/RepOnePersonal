const stateRoot = state => state.kratosCollapsedSettingsSetMetrics;

export const getCurrentKratosCollapsedMetricRank = state =>
    stateRoot(state).currentKratosCollapsedMetricRank;

export const getKratosMetric1 = state => stateRoot(state).metric1;

export const getKratosMetric2 = state => stateRoot(state).metric2;

export const getKratosMetric3 = state => stateRoot(state).metric3;

export const getKratosMetric4 = state => stateRoot(state).metric4;

export const getKratosMetric5 = state => stateRoot(state).metric5;

export const getKratosRollup1 = state => stateRoot(state).rollup1;

export const getKratosRollup2 = state => stateRoot(state).rollup2;

export const getKratosRollup3 = state => stateRoot(state).rollup3;

export const getKratosRollup4 = state => stateRoot(state).rollup4;

export const getKratosRollup5 = state => stateRoot(state).rollup5;

export const getKratosPhase1 = state => stateRoot(state).phase1;

export const getKratosPhase2 = state => stateRoot(state).phase2;

export const getKratosPhase3 = state => stateRoot(state).phase3;

export const getKratosPhase4 = state => stateRoot(state).phase4;

export const getKratosPhase5 = state => stateRoot(state).phase5;

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
