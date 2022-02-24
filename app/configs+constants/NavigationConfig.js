import React from 'react';
import { SceneMap } from 'react-native-tab-view';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

import WorkoutScreen from 'app/features/workout/WorkoutScreen';
import SettingsTab from 'app/features/settings/SettingsTab';
import AnalysisScreen from 'app/features/analysis/AnalysisScreen';
import HistoryScreen from 'app/features/history/HistoryScreen';
import ScalarScreen from '../features/scalar/ScalarScreen';

export const initialIndex = OpenBarbellConfig.scalarEnabled ? 4 : 3;

export const routes = OpenBarbellConfig.scalarEnabled ? [
    { key: '0', title: 'WORKOUT' },
    { key: '1', title: 'SCALAR' },
    { key: '2', title: 'HISTORY' },
    { key: '3', title: 'ANALYSIS' },
    { key: '4', title: 'SETTINGS', badge: true },
] : [
    { key: '0', title: 'WORKOUT' },
    { key: '1', title: 'HISTORY' },
    { key: '2', title: 'ANALYSIS' },
    { key: '3', title: 'SETTINGS', badge: true },
];

export const sceneMap = SceneMap(OpenBarbellConfig.scalarEnabled ? {
    '0': () => <WorkoutScreen />,
    '1': () => <ScalarScreen />,
    '2': () => <HistoryScreen />,
    '3': () => <AnalysisScreen />,
    '4': () => <SettingsTab />
} : {
    '0': () => <WorkoutScreen />,
    '1': () => <HistoryScreen />,
    '2': () => <AnalysisScreen />,
    '3': () => <SettingsTab />
});
