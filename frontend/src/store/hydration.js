
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

export function reviewHydrationActionCreator (id) {
    return {
        type: 'reviewHydration',
        payload: {reviews: true, id}
    }
}

const initialState = {spots: false, reviews: false, id: null};

export function hydrationReducer (state = initialState, action) {
    switch(action.type){
        case 'hydration':
            let newState = {...state, ...action.payload};

            return newState;

        case 'spotHydration':
            let spotState = {...state, ...action.payload};
            return spotState;

        case 'reviewHydration':
            let reviewState = {...state, ...action.payload};
            return reviewState

        default: return state;
    }
}
