import {
    MAP_BULK_DATA,
    ADD_BULK_DATA,
    UPDATE_BULK_SAMPLE_COUNT,
    CLEAR_BULK_DATA_MAP,
    LOGOUT,
} from 'app/configs+constants/ActionTypes';

const defaultState = {
};

const BulkDataReducer = (state = defaultState, action) => {
    switch (action.type) {
        // note: assumes map bulk data will always run before the actual bulk data is sent over
        case MAP_BULK_DATA: {
            let nextState = { ...state };
            nextState[action.deviceRepID] = {
                setID: action.setID,
                repIndex: action.repIndex,
                totalSampleCount: null,
                receivedSampleCount: 0,
                bulk: {},
            };
            return nextState;
        }
        case ADD_BULK_DATA: {
            if (state[action.deviceRepID].bulk[action.sampleID] === undefined) {
                let nextState = { ...state };
                nextState[action.deviceRepID].bulk = { ...nextState[action.deviceRepID].bulk };
                nextState[action.deviceRepID].receivedSampleCount += 1;
                nextState[action.deviceRepID].bulk[action.sampleID] = {
                    sampleID: action.sampleID,
                    time: action.time,
                    x: action.x,
                    y: action.y,
                    z: action.z,
                };
                return nextState;
            } else {
                return state;
            }
        }
        case UPDATE_BULK_SAMPLE_COUNT: {
            let nextState = { ...state };
            nextState[action.deviceRepID].totalSampleCount = action.totalSampleCount; 
            return nextState;
        }
        case CLEAR_BULK_DATA_MAP: {
            let nextState = { ...state };
            delete nextState[action.deviceRepID];
            return nextState;
        }
        case LOGOUT:
            return defaultState;
        default:
            return state;
    }
};

export default BulkDataReducer;
