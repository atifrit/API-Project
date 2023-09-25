
export function hydrationActionCreator () {
    return {
        type: 'hydration',
        payload: {spots: true}
    }
}

const initialState = {spots: false};
export function hydrationReducer (state = initialState, action) {
    switch(action.type){
        case 'hydration':
            let newState = {...state, ...action.payload};

            return newState;

        default: return state;
    }
}
