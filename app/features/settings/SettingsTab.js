import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';
import SettingsHelpScreen from './help/SettingsHelpScreen';
import SettingsSurveyScreen from './survey/SettingsSurveyScreen';
import SettingsOTAScreen from './ota/SettingsOTAScreen';
import SettingsDeviceScreen from './device/SettingsDeviceScreen';
import SettingsAccountScreen from './account/SettingsAccountScreen';
import SettingsApplicationScreen from './application/SettingsApplicationScreen';
import SettingsFeedbackScreen from './feedback/SettingsFeedbackScreen';
import SettingsColumnsScreen from './columns/SettingsColumnsScreen';
import SettingsCalibrationScreen from './calibration/SettingsCalibrationScreen';
import SettingsRepOnePanel from './sensor/repone/SettingsRepOnePanel';

class SettingsTab extends Component {
    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        marginBottom: 20,
                    }}>
                    <SettingsHelpScreen />
                    <SettingsSurveyScreen />
                    <SettingsOTAScreen />
                    <SettingsDeviceScreen />
                    <SettingsApplicationScreen />
                    <SettingsAccountScreen />
                    <SettingsColumnsScreen />
                    <SettingsRepOnePanel />
                    <SettingsFeedbackScreen />
                    {OpenBarbellConfig.calibrationEnabled ? (
                        <SettingsCalibrationScreen />
                    ) : null}
                </View>
            </ScrollView>
        );
    }
}

export default SettingsTab;
