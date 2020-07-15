import {
    ATTEMPT_LOG_REP_START_POSITION,
    ATTEMPT_LOG_REP_END_POSITION,
    ADD_3D_POSITIONS_TO_REP,
} from 'app/configs+constants/ActionTypes';

export const tappedLogStart = () => {
    return {
        type: ATTEMPT_LOG_REP_START_POSITION,
    };
};

export const tappedLogEnd = () => {
    return {
        type: ATTEMPT_LOG_REP_END_POSITION,
    };
};

export const tappedAddToRep = (start, end) => {
    return {
        type: ADD_3D_POSITIONS_TO_REP,
        start,
        end,
    };
};
