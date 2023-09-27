
export function hydrationActionCreator () {
    return {
        type: 'hydration',
        payload: {spots: true}
    }
}

export function spotHydrationActionCreator () {
    return {
        type:'spotHydration',
        payload: {spotHydration:true}
    }
}

const initialState = {spots: false};
export function hydrationReducer (state = initialState, action) {
    switch(action.type){
        case 'hydration':
            let newState = {...state, ...action.payload};

            return newState;

        case 'spotHydration':
            let spotState = {...state, ...action.payload};
            return spotState;

        default: return state;
    }
}
