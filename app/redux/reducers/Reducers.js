import { combineReducers } from 'redux';
import SetsReducer from './SetsReducer';
import ScannedDevicesReducer from './ScannedDevicesReducer';
import ConnectedDeviceReducer from './ConnectedDeviceReducer';
import WorkoutReducer from './WorkoutReducer';
import WorkoutCollapsedReducer from './WorkoutCollapsedReducer';
import HistoryReducer from './HistoryReducer';
import HistoryCollapsedReducer from './HistoryCollapsedReducer';
import KillSwitchReducer from './KillSwitchReducer';
import AuthReducer from './AuthReducer';
import SettingsReducer from './SettingsReducer';
import CollapsedSettingsReducer from './CollapsedSettingsReducer';
import ColumnsSettingsReducer from './ColumnsSettingsReducer';
import SuggestionsReducer from './SuggestionsReducer';
import AppStateReducer from './AppStateReducer';
import DurationsReducer from './DurationsReducer';
import AnalysisReducer from './AnalysisReducer';
import SurveyReducer from './SurveyReducer';
import OTAReducer from './OTAReducer';
import CalibrationReducer from './CalibrationReducer';
import ScalarReducer from './ScalarReducer';
import VisualizationReducer from './VisualizationReducer';
import KratosCollapsedSettingsSetMetricsReducer from './KratosCollapsedSettingsSetMetricsReducer';
import KratosColumnsSettingsReducer from './KratosColumnsSettingsReducer';

export default reducers = combineReducers({
    sets: SetsReducer,
    scannedDevices: ScannedDevicesReducer,
    connectedDevice: ConnectedDeviceReducer,
    workout: WorkoutReducer,
    workoutCollapsed: WorkoutCollapsedReducer,
    history: HistoryReducer,
    historyCollapsed: HistoryCollapsedReducer,
    killSwitch: KillSwitchReducer,
    auth: AuthReducer,
    suggestions: SuggestionsReducer,
    settings: SettingsReducer,
    collapsedSettings: CollapsedSettingsReducer,
    kratosCollapsedSettingsSetMetrics: KratosCollapsedSettingsSetMetricsReducer,
    columnsSettings: ColumnsSettingsReducer,
    kratosColumnsSettings: KratosColumnsSettingsReducer,
    appState: AppStateReducer,
    durations: DurationsReducer,
    analysis: AnalysisReducer,
    survey: SurveyReducer,
    ota: OTAReducer,
    calibration: CalibrationReducer,
    scalar: ScalarReducer,
    visualization: VisualizationReducer,
});
