import { getKratosEnabled } from 'app/configs+constants/KratosConfig';

export const getDeviceType = deviceName => {
    if (getKratosEnabled() && deviceName.startsWith('Kratos')) {
        return 'Kratos';
    }

    if (deviceName.startsWith('Cormax')) {
        return 'Cormax';
    }

    return 'RepOne';
};

export const getDeviceDisplayName = deviceName => {
    const deviceNameRe = /(RepOne|Kratos|Cormax) \b[a-zA-Z0-9]+\b/;
    if (!deviceNameRe.test(deviceName)) {
        // fallback if we get a wrong string format for some reason
        return deviceName;
    }

    const [deviceType, id] = deviceName.split(' ');
    return `${deviceType} #${id}`;
};
