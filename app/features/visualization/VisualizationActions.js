import {
    HIDE_VISUALIZATION_MODAL,
} from 'app/configs+constants/ActionTypes';

export const tappedClose = () => {
    return {
        type: HIDE_VISUALIZATION_MODAL,
    };
};
