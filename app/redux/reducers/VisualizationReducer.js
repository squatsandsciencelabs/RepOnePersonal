import {
    SHOW_VISUALIZATION_MODAL,
    HIDE_VISUALIZATION_MODAL,
} from 'app/configs+constants/ActionTypes';

const defaultState = {
   isShowingVisualization: false,
   setID: null,
   rep: null, // this one is weird, should it be index or should it be the id itself? Tough as it shouldn't loop through removed or invalid ones after all
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SHOW_VISUALIZATION_MODAL:
            return {
                ...state,
                isShowingVisualization: true,
            };
        case HIDE_VISUALIZATION_MODAL:
            return {
                ...state,
                isShowingVisualization: false,
            };
        default:
            return state;
    }
};
