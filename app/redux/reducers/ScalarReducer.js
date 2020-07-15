import {
    LOG_REP_START_POSITION,
    LOG_REP_END_POSITION,
    ADD_3D_POSITIONS_TO_REP, // NOT SURE, it shouldn't clear it until it adds right?
} from 'app/configs+constants/ActionTypes';

const defaultState = {
    start: [], // contains objects of x, y, z
    end: [], // contains objects of x, y, z
    results: [], // contains objects rom, start{avgx, avgy, avgz}, end{avgx, avgy, avgz}
}

const calculateAverageStart = (state, newStartObj=null) => {
    let count = state.start.length + (newStartObj === null ? 0 : 1);
    if (count === 0) {
        return null;
    }

    let x = 0;
    let y = 0;
    let z = 0;
    state.start.forEach(p => {
        x += parseFloat(p.x);
        y += parseFloat(p.y);
        z += parseFloat(p.z);
    });

    if (newStartObj) {
        x += parseFloat(newStartObj.x);
        y += parseFloat(newStartObj.y);
        z += parseFloat(newStartObj.z);
    }
    return {
        x: x/count,
        y: y/count,
        z: z/count,
    };
};

const calculateAverageEnd = (state, newEndObj=null) => {
    let count = state.end.length + (newEndObj === null ? 0 : 1);
    if (count === 0) {
        return null;
    }
    console.tron.log(`calc avg end count ${count}`);

    let x = 0;
    let y = 0;
    let z = 0;
    console.tron.log(`calc avg end x ${x} y ${y} z ${z}`);
    state.end.forEach(p => {
        x += parseFloat(p.x);
        y += parseFloat(p.y);
        z += parseFloat(p.z);
        console.tron.log(`calc avg end x ${x} y ${y} z ${z}`);
    });

    if (newEndObj) {
        x += parseFloat(newEndObj.x);
        y += parseFloat(newEndObj.y);
        z += parseFloat(newEndObj.z);
        console.tron.log(`final calc avg end x ${x} y ${y} z ${z}`);
    }

    console.tron.log(`calc avg end divi check x ${typeof x} y ${typeof y} z ${typeof z} count ${typeof count} len ${typeof state.end.length}`);
    console.tron.log(`calc avg end divi check x ${x/count} y ${y/count} z ${z/count}`);
    return {
        x: x/count,
        y: y/count,
        z: z/count,
    };
};

const calculateDistance = (startObj, endObj) => {
    return Math.sqrt(Math.pow(endObj.x-startObj.x, 2) + Math.pow(endObj.y-startObj.y, 2) + Math.pow(endObj.z-startObj.z, 2));
};

// TODO: needs to replace the last result if it exists
const calculateResults = (state, newStartObj=null, newEndObj=null) => {
    const averageStart = calculateAverageStart(state, newStartObj);
    const averageEnd = calculateAverageEnd(state, newEndObj);
    console.tron.log(`aclculate results start ${JSON.stringify(averageStart)} ${JSON.stringify(averageEnd)}`);
    if (averageStart === null || averageEnd === null) {
        return state.results;
    }

    const rom = calculateDistance(averageStart, averageEnd);
    const results = state.results.slice(0, state.results.length-1);
    results.push({
        rom,
        averageStart,
        averageEnd,
    });

    return results;
};

const ScalarReducer = (state = defaultState, action) => {
    switch (action.type) {
        case LOG_REP_START_POSITION: {
            const startObj = {x: action.x, y: action.y, z: action.z};
            return {
                ...state,
                start: [...state.start, startObj],
                results: calculateResults(state, startObj, null),
            };
        }
        case LOG_REP_END_POSITION: {
            const endObj = {x: action.x, y: action.y, z: action.z};
            return {
                ...state,
                end: [...state.end, endObj],
                results: calculateResults(state, null, endObj),
            };
        }
        case ADD_3D_POSITIONS_TO_REP:
            // clear start and end, as other reducer handles adding it to rep
            return {
                ...state,
                start: [],
                end: [],
                results: [...state.results, {rom: null, averageStart: null, averageEnd: null}]
            };
        default: 
            return state;
    }
};

export default ScalarReducer;
