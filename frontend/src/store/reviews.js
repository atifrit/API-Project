import { csrfFetch } from './csrf';


const initialState = {};

const READ_ALL_REVIEWS = '/reviews';
const DELETE_REVIEW = '/review/delete';
const POST_REVIEW = '/spot/:spotId/reviews';


function readReviewsBySpotActionCreator (payload) {
    return {
        type: READ_ALL_REVIEWS,
        payload
    }
}

function postReviewActionCreator (payload, id) {
    return {
        type: POST_REVIEW,
        payload,
        id
    }
}

function deleteReviewActionCreator (id) {
    return {
        type: DELETE_REVIEW,
        id
    }
}


export const reviewsReducer = (state=initialState, action) => {
    let newState = {}
    switch (action.type) {
        case READ_ALL_REVIEWS:
            newState={...state, ...action.payload};
            return newState;
        case POST_REVIEW:
            newState = {...state, ...action.payload};
            return newState;
        case DELETE_REVIEW:
            newState = {...state};
            delete newState[action.id];
            return newState;
        default: return state
    }
}

export const readReviewsBySpotThunkActionCreator = (id) => async dispatch => {
    let reviews = await csrfFetch(`/api/spots/${id}/reviews`, {method:'GET'});
    let data = await reviews.json();

    let normalizedObj = {};

    data.Reviews.forEach((review) => {
        normalizedObj[review.id] = review
    })
    dispatch(readReviewsBySpotActionCreator(normalizedObj));
}


export const postReviewThunkActionCreator = (formData, id, user) => async dispatch => {
    let newReview = await csrfFetch(`/api/spots/${id}/reviews`, {method:'POST', body:JSON.stringify(formData)});
    let data = await newReview.json();


    let normalizedObj = {};

    normalizedObj[data.id] = {...data, User:user};
    console.log('user', user);
    dispatch(postReviewActionCreator(normalizedObj, id));
}

export const deleteReviewThunkActionCreator = (id) => async dispatch => {
    await csrfFetch(`/api/reviews/${id}`, {method:'DELETE'});


    dispatch(deleteReviewActionCreator(id));
}
