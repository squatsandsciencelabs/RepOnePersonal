import React, { Component } from 'react';

import SensorSettingsCard from 'app/features/settings/sensor/SensorSettingsCard';
import SettingsRepOneSensorRepColumns from './SettingsRepOneSensorRepColumns';
import SettingsRepOneSensorSetMetrics from './SettingsRepOneSensorSetMetrics';

const sensorName = 'RepOne Sensor';

class SettingsRepOnePanel extends Component {
    render() {
        return (
            <SensorSettingsCard sensorName={sensorName}>
                <SettingsRepOneSensorRepColumns sensorName={sensorName} />
                <SettingsRepOneSensorSetMetrics sensorName={sensorName} />
            </SensorSettingsCard>
        );
    }
}

export default SettingsRepOnePanel;
