const stateRoot = (state) => state.ota;

export const getFirmwareVersion = (state) => stateRoot(state).firmwareVersion;

export const getFileURL = (state) => stateRoot(state).fileURL;

export const getStatus = (state) => stateRoot(state).status;
