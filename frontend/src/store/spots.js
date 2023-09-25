import { csrfFetch } from './csrf';


const initialState = {};
const READ_ALL_SPOTS = '/spots'


export const spotsReducer = (state=initialState, action) => {
    let newState = {}
    switch(action.type) {
        case READ_ALL_SPOTS:
            newState = {...state, ...action.payload};
            return newState;


        default: return state;
    }
}

    const spotAction = (spotsPOJO) => {return {
        type: READ_ALL_SPOTS,
        payload: spotsPOJO
    };}

export const readSpotsThunkActionCreator = () => async dispatch => {
    let response = await csrfFetch('/api/spots', {method:'GET'});
    let spotsPOJO = await response.json();

    let normalizedObj = {};


    spotsPOJO.Spots.forEach(element => {
        normalizedObj[element.id] = element;
    });
    dispatch(spotAction(normalizedObj));
}
