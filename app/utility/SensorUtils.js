export const getDeviceType = deviceName => {
    return deviceName.startsWith('Kratos') ? 'Kratos' : 'RepOne';
};

export const getDeviceDisplayName = deviceName => {
    const deviceNameRe = /(RepOne|Kratos) \b[a-zA-Z0-9]+\b/;
    if (!deviceNameRe.test(deviceName)) {
        // fallback if we get a wrong string format for some reason
        return deviceName;
    }

    const [deviceType, id] = deviceName.split(' ');
    return `${deviceType} #${id}`;
};
