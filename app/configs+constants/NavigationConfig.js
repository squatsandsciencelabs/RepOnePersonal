import React from 'react';
import { SceneMap } from 'react-native-tab-view';

import WorkoutScreen from 'app/features/workout/WorkoutScreen';
import SettingsTab from 'app/features/settings/SettingsTab';
import AnalysisScreen from 'app/features/analysis/AnalysisScreen';
import HistoryScreen from 'app/features/history/HistoryScreen';
import ScalarScreen from '../features/scalar/ScalarScreen';

export const initialIndex = 3;

export const routes = [
    { key: '0', title: 'WORKOUT' },
    { key: '1', title: 'SCALAR' },
    { key: '2', title: 'HISTORY' },
    { key: '3', title: 'ANALYSIS'},
    { key: '4', title: 'SETTINGS' },       
];

export const routesWithUpdate = [
    { key: '0', title: 'WORKOUT' },
    { key: '1', title: 'SCALAR' },
    { key: '2', title: 'HISTORY' },
    { key: '3', title: 'ANALYSIS'},
    { key: '4', title: '•SETTINGS' },       
];

export const sceneMap = SceneMap({
    '0': () => <WorkoutScreen />,
    '1': () => <ScalarScreen />,
    '2': () => <HistoryScreen />,
    '3': () => <AnalysisScreen />,
    '4': () => <SettingsTab />
});
