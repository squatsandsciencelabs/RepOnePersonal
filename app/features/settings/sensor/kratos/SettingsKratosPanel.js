import React, { Component } from 'react';

import SensorSettingsCard from 'app/features/settings/sensor/SensorSettingsCard';
import SettingsKratosAutoDeleteRepsScreen from './kratos_auto_delete_reps/SettingsKratosAutoDeleteRepsScreen';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';
import SettingsKratosMetricsScreen from './metrics/SettingsKratosMetricsScreen';
import SettingsKratosRepColumnsScreen from './rep_columns/SettingsKratosRepColumnsScreen';

const sensorName = 'Kratos';

class SettingsKratosPanel extends Component {
    render() {
        if (!getKratosEnabled()) {
            return null;
        }
        return (
            <SensorSettingsCard sensorName={sensorName}>
                <SettingsKratosMetricsScreen sensorName={sensorName} />
                <SettingsKratosRepColumnsScreen sensorName={sensorName} />
                <SettingsKratosAutoDeleteRepsScreen />
            </SensorSettingsCard>
        );
    }
}

export default SettingsKratosPanel;
