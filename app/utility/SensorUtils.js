export const getDeviceType = deviceName => {
    return deviceName.startsWith('Kratos') ? 'Kratos' : 'RepOne';
};
