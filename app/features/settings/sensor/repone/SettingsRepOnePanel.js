import React, { Component } from 'react';

import SensorSettingsCard from 'app/features/settings/sensor/SensorSettingsCard';
import SettingsRepOneMetricsScreen from './metrics/SettingsRepOneMetricsScreen';
import SettingsRepOneRepColumnsScreen from './rep_columns/SettingsRepOneRepColumnsScreen';

const sensorName = 'RepOne Sensor';

class SettingsRepOnePanel extends Component {
    render() {
        return (
            <SensorSettingsCard sensorName={sensorName}>
                <SettingsRepOneMetricsScreen sensorName={sensorName} />
                <SettingsRepOneRepColumnsScreen sensorName={sensorName} />
            </SensorSettingsCard>
        );
    }
}

export default SettingsRepOnePanel;
