import React, { Component } from 'react';

import SensorSettingsCard from 'app/features/settings/sensor/SensorSettingsCard';
import SettingsRepOneMetricsScreen from './metrics/SettingsRepOneMetricsScreen';
import SettingsRepOneRepColumnsScreen from './rep_columns/SettingsRepOneRepColumnsScreen';
import TextLink from 'app/shared_features/text_link/TextLink';

const sensorName = 'RepOne Sensor';

class SettingsRepOnePanel extends Component {
    render() {
        return (
            <SensorSettingsCard sensorName={sensorName}>
                <TextLink
                    style={{ paddingVertical: 17.5 }}
                    text="What are these metrics?"
                    link="https://www.reponestrength.com/knowledge#repone-set-metrics"
                />
                <SettingsRepOneMetricsScreen sensorName={sensorName} />
                <SettingsRepOneRepColumnsScreen sensorName={sensorName} />
            </SensorSettingsCard>
        );
    }
}

export default SettingsRepOnePanel;
