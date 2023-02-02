import React, { Component } from 'react';

import SensorSettingsCard from 'app/features/settings/sensor/SensorSettingsCard';
import SettingsKratosAutoDeleteRepsScreen from './kratos_auto_delete_reps/SettingsKratosAutoDeleteRepsScreen';

const sensorName = 'Kratos';

class SettingsKratosPanel extends Component {
    render() {
        return (
            <SensorSettingsCard sensorName={sensorName}>
                <SettingsKratosAutoDeleteRepsScreen />
            </SensorSettingsCard>
        );
    }
}

export default SettingsKratosPanel;
