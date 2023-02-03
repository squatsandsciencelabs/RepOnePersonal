import { DISMISS_KRATOS_ROLLUP } from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as KratosCollapsedSettingsSetMetricsActionCreators from 'app/redux/shared_actions/KratosCollapsedSettingsSetMetricsActionCreators';
import * as KratosCollapsedSettingsSetMetricsSelectors from 'app/redux/selectors/KratosCollapsedSettingsSetMetricsSelectors';

export const saveRollupSetting = rollup => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosRollup(
            state,
        );
    const rank =
        KratosCollapsedSettingsSetMetricsSelectors.getCurrentKratosCollapsedMetricRank(
            state,
        );
    logChangeRollupAnalytics(rank, prevRollup, rollup, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollup(
            rollup,
        ),
    );
};

export const saveRollup1Setting = rollup => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup1(state);
    logChangeRollupAnalytics(1, prevRollup, rollup, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollup1(
            rollup,
        ),
    );
};

export const saveRollup2Setting = rollup => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup2(state);
    logChangeRollupAnalytics(2, prevRollup, rollup, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollup2(
            rollup,
        ),
    );
};

export const saveRollup3Setting = rollup => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup3(state);
    logChangeRollupAnalytics(3, prevRollup, rollup, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollup3(
            rollup,
        ),
    );
};

export const saveRollup4Setting = rollup => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup4(state);
    logChangeRollupAnalytics(4, prevRollup, rollup, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollup4(
            rollup,
        ),
    );
};

export const saveRollup5Setting = rollup => (dispatch, getState) => {
    const state = getState();
    const prevRollup =
        KratosCollapsedSettingsSetMetricsSelectors.getKratosRollup5(state);
    logChangeRollupAnalytics(5, prevRollup, rollup, state);

    dispatch(
        KratosCollapsedSettingsSetMetricsActionCreators.saveKratosRollup5(
            rollup,
        ),
    );
};

export const dismissRollupSetter = () => {
    Analytics.setCurrentScreen('settings');

    return {
        type: DISMISS_KRATOS_ROLLUP,
    };
};

// ANALYTICS

const logChangeRollupAnalytics = (rank, prevRollup, rollup, state) => {
    Analytics.logEventWithAppState(
        'change_kratos_rollup',
        {
            rank: rank,
            from_rollup: prevRollup,
            to_rollup: rollup,
        },
        state,
    );
};
