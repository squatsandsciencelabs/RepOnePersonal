import {
    HIDE_VISUALIZATION_MODAL,
    NAVIGATE_VISUALIZATION_REP,
} from 'app/configs+constants/ActionTypes';

export const tappedClose = () => {
    return {
        type: HIDE_VISUALIZATION_MODAL,
    };
};

export const navigateToRep = index => {
    return {
        type: NAVIGATE_VISUALIZATION_REP,
        index,
    };
};
