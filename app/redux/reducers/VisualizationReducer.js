import {
    SHOW_VISUALIZATION_MODAL,
    HIDE_VISUALIZATION_MODAL,
} from 'app/configs+constants/ActionTypes';

const defaultState = {
   setID: null,
   repID: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SHOW_VISUALIZATION_MODAL:
            return {
                ...state,
                setID: action.setID,
            };
        case HIDE_VISUALIZATION_MODAL:
            return {
                ...state,
                setID: null,
                repID: null,
            };
        default:
            return state;
    }
};
