import React, { Component } from 'react';

import SensorSettingsCard from 'app/features/settings/sensor/SensorSettingsCard';
import SettingsKratosAutoDeleteRepsScreen from './kratos_auto_delete_reps/SettingsKratosAutoDeleteRepsScreen';
import { View } from 'react-native';

const sensorName = 'Kratos';

class SettingsKratosPanel extends Component {
    render() {
        return (
            <SensorSettingsCard sensorName={sensorName}>
                <View style={{ marginTop: 40 }}>
                    <SettingsKratosAutoDeleteRepsScreen />
                </View>
            </SensorSettingsCard>
        );
    }
}

export default SettingsKratosPanel;
