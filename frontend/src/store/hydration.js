
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

export function falseSpotHydrationActionCreator () {
    return {
        type: 'falseSpotHydration',
        payload: {spots: false}
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
        case 'falseSpotHydration':
            let falseSpotState = {...state, ...action.payload};
            return falseSpotState;

        default: return state;
    }
}
