import React, { Component } from 'react';

import SensorSettingsCard from 'app/features/settings/sensor/SensorSettingsCard';
import SettingsRepOneSensorRepColumns from './SettingsRepOneSensorRepColumns';
import SettingsRepOneMetricsScreen from './metrics/SettingsRepOneMetricsScreen';

const sensorName = 'RepOne Sensor';

class SettingsRepOnePanel extends Component {
    render() {
        return (
            <SensorSettingsCard sensorName={sensorName}>
                <SettingsRepOneMetricsScreen sensorName={sensorName} />
                <SettingsRepOneSensorRepColumns sensorName={sensorName} />
            </SensorSettingsCard>
        );
    }
}

export default SettingsRepOnePanel;
