import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const isSmallDevice = () => {
    const { width } = Dimensions.get('window');

    return (width <= 350);
};


export const hasNotch = () => Platform.OS === 'ios' && DeviceInfo.hasNotch();

export const hasDynamicIsland = () =>
    Platform.OS === 'ios' && DeviceInfo.hasDynamicIsland();
