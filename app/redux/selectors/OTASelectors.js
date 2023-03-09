import { createSelector } from 'reselect';
import { OTAStatus } from '../reducers/OTAReducer';

const stateRoot = state => state.ota;

export const getFirmwareVersion = state => stateRoot(state).firmwareVersion;

export const getFirmwareDescription = state =>
    stateRoot(state).firmwareDescription;

export const getStatus = state => stateRoot(state).status;

// not memoizing as memoizing would require 2 if checks here, whereas this coudl actually have less
export const getIsInstalling = state =>
    getStatus(state) === OTAStatus.INSTALLING || getProgress(state) !== 0;

export const getProgress = state => stateRoot(state).progress;

export const getProgressDividedBy100 = createSelector(getProgress, progress => {
    return progress / 100.0;
});
