import { csrfFetch } from './csrf';


const initialState = {};

const READ_ALL_REVIEWS = '/reviews';
const READ_ONE_REVIEW = '/review';
const POST_REVIEW = '/spot/:spotId/reviews';
const POST_IMAGES = '/spot/:spotId/reviews/images';
const UPDATE_SPOT = '/spot/:spotId/reviews/edit';
const DELETE_SPOT = '/spot/:spotId/reviews/delete';

function readReviewsBySpotActionCreator (payload) {
    return {
        type: READ_ALL_REVIEWS,
        payload
    }
}




export const reviewsReducer = (state=initialState, action) => {
    let newState = {}
    switch (action.type) {
        case READ_ALL_REVIEWS:
            newState={...state, ...action.payload};
            return newState

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
