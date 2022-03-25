import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';
import SettingsHelpScreen from './help/SettingsHelpScreen';
// import SettingsSurveyScreen from './survey/SettingsSurveyScreen';
import SettingsOTAScreen from './ota/SettingsOTAScreen';
import SettingsDeviceScreen from './device/SettingsDeviceScreen';
// import SettingsAccountScreen from './account/SettingsAccountScreen';
import SettingsApplicationScreen from './application/SettingsApplicationScreen';
import SettingsFeedbackScreen from './feedback/SettingsFeedbackScreen';
import SettingsCalibrationScreen from './calibration/SettingsCalibrationScreen';
import SettingsRepOnePanel from './sensor/repone/SettingsRepOnePanel';
import SettingsKratosScreen from 'app/features/settings/sensor/kratos/SettingsKratosScreen';

function SettingsTab() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: insets.bottom }}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    marginBottom: 20,
                }}>
                <SettingsHelpScreen />
                {/* <SettingsSurveyScreen /> */}
                <SettingsOTAScreen />
                <SettingsDeviceScreen />
                <SettingsApplicationScreen />
                {/* <SettingsAccountScreen /> */}
                <SettingsRepOnePanel />
                <SettingsKratosScreen />
                <SettingsFeedbackScreen />
                {OpenBarbellConfig.calibrationEnabled ? (
                    <SettingsCalibrationScreen />
                ) : null}
            </View>
        </ScrollView>
    );
}

export default SettingsTab;
