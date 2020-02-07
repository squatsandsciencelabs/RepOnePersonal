import { OTAStatus } from "../reducers/OTAReducer";

const stateRoot = (state) => state.ota;

export const getFirmwareVersion = (state) => stateRoot(state).firmwareVersion;

export const getStatus = (state) => stateRoot(state).status;

export const getIsInstalling = (state) => getStatus(state) === OTAStatus.INSTALLING || getProgress(state) !== 0;

export const getProgress = (state) => stateRoot(state).progress;
