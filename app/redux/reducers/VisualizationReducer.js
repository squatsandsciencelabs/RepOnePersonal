import {
    SHOW_VISUALIZATION_MODAL,
    NAVIGATE_VISUALIZATION_REP,
    HIDE_VISUALIZATION_MODAL,
} from 'app/configs+constants/ActionTypes';

const defaultState = {
   setID: null,
   repIndex: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SHOW_VISUALIZATION_MODAL:
            return {
                ...state,
                setID: action.setID,
            };
        case NAVIGATE_VISUALIZATION_REP:
            return {
                ...state,
                repIndex: action.index,
            };
        case HIDE_VISUALIZATION_MODAL:
            return {
                ...state,
                setID: null,
                repIndex: null,
            };
        default:
            return state;
    }
};
