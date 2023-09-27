import { csrfFetch } from './csrf';


const initialState = {};
const READ_ALL_SPOTS = '/spots';
const READ_ONE_SPOT = '/spotid';


export const spotsReducer = (state=initialState, action) => {
    let newState = {}
    switch(action.type) {
        case READ_ALL_SPOTS:
            newState = {...state, ...action.payload};
            return newState;
        case READ_ONE_SPOT:
            newState = {...state, ...action.payload};
            return newState;

        default: return state;
    }
}

    const spotsActionCreator = (spotsPOJO) => {return {
        type: READ_ALL_SPOTS,
        payload: spotsPOJO
    };}

    const spotActionCreator = (spotPOJO) => {return {
        type: READ_ONE_SPOT,
        payload: spotPOJO
    }}


export const readSpotsThunkActionCreator = () => async dispatch => {
    let response = await csrfFetch('/api/spots', {method:'GET'});
    let spotsPOJO = await response.json();

    let normalizedObj = {};


    spotsPOJO.Spots.forEach(element => {
        normalizedObj[element.id] = {Owner:null, spotImages:null, ...element}
    });
    dispatch(spotsActionCreator(normalizedObj));
}


export const readSpotByIdThunkActionCreator = (spotId) => async dispatch => {
    let response = await csrfFetch(`/api/spots/${spotId}`);
    let spotPOJO = await response.json();

    console.log(spotPOJO);

    let normalizedObj = {[spotId]:{...spotPOJO, 'Owner':{...spotPOJO.Owner}, spotImages:{...spotPOJO.spotImages}}};

    dispatch(spotActionCreator(normalizedObj));
}
