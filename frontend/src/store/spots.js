import { csrfFetch } from './csrf';


const initialState = {};
const READ_ALL_SPOTS = '/spots';
const READ_ONE_SPOT = '/spotid';
const POST_SPOT = '/spot/new';
const POST_IMAGES = '/spot/image';
const UPDATE_SPOT = '/spot/update';
const DELETE_SPOT = '/spot/delete';


export const spotsReducer = (state=initialState, action) => {
    let newState = {}
    switch(action.type) {
        case READ_ALL_SPOTS:
            newState = {...state, ...action.payload};
            return newState;
        case READ_ONE_SPOT:
            newState = {...state, ...action.payload};
            return newState;
        case POST_SPOT:
            newState = {...state, ...action.payload}
            return newState
        case POST_IMAGES:
            newState = {...state, [action.id]:{...state[action.id], spotImages:[...action.payload], previewImage:action.payload[0].url}};
            return newState;
        case UPDATE_SPOT:
            newState = {...state, [action.id]:{...state[action.id], ...action.payload}};
            return newState;
        case DELETE_SPOT:
            newState = {...state};
            delete newState[action.id];
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

    const postSpotActionCreator = (spotPOJO) => {return {
        type: POST_SPOT,
        payload: spotPOJO
    }}

    const postImagesActionCreator = (imagesArr, id) => {return {
        type: POST_IMAGES,
        payload:imagesArr,
        id
    }}

    const updateSpotActionCreator = (payload, id) => {
        return {
            type: UPDATE_SPOT,
            payload,
            id
        }
    }

    const deleteSpotActionCreator = (id) => {
        return {
            type: DELETE_SPOT,
            id
        }
    }

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


export const createSpotThunkActionCreator = (formData) => async dispatch => {

    let {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      } = formData

      console.log(address, city, state, country, name, description, price);
    let response = await csrfFetch('/api/spots', {method:'POST', body:JSON.stringify({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      })});
    let data = await response.json();
    data.Owner=null
    data.spotImages=null
    console.log(data);
    let normalizedObj = {[data.id]:{...data}}
    dispatch(postSpotActionCreator(normalizedObj));
    return data;
}

export const addImagesThunkActionCreator = (formData, newSpotId) => async dispatch => {
    let {
        previewImage,
        image1,
        image2,
        image3,
        image4
    } = formData

    let receivedInfoArr = [
        {url:previewImage, preview: true},
        {url:image1, preview:false},
        {url:image2, preview:false},
        {url:image3, preview:false},
        {url:image4, preview:false}
    ]

    for (let i = 0; i < receivedInfoArr.length; i++) {

            await csrfFetch(`/api/spots/${newSpotId}/images`, {method:'POST', body:JSON.stringify(receivedInfoArr[i])});

    }

    dispatch(postImagesActionCreator(receivedInfoArr, newSpotId));
    return null
}


export const updateSpotThunkActionCreator = (formData, spotId) => async dispatch => {
    let {
        country,
        address,
        city,
        state,
        description,
        name,
        price
    } = formData;

    let inputData = {country,
        address,
        city,
        state,
        description,
        name,
        price,
        lat:1,
        lng:1,
        spotId
    }

    let id = spotId;

    await csrfFetch(`/api/spots/${id}`, {method:'PUT', body:JSON.stringify({...inputData})})

    dispatch(updateSpotActionCreator(inputData, id))
}

export const deleteSpotThunkActionCreator = (id) => async dispatch => {

    await csrfFetch(`/api/spots/${id}`, {method:'DELETE'});


    dispatch(deleteSpotActionCreator(id));

}
