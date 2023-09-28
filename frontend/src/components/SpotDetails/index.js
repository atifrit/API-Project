import * as spotsActions from '../../store/spots';
import { useDispatch, useSelector } from "react-redux";
import { hydrationActionCreator } from '../../store/hydration';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { readReviewsBySpotThunkActionCreator } from '../../store/reviews';
import { reviewHydrationActionCreator } from '../../store/hydration';
import './SpotDetails.css'

export default function SpotDetails () {
    let dispatch = useDispatch();
    let {id} = useParams();

    let spotHydration = useSelector((state) => state.hydration.spots);

    let spots = useSelector((state) => state.spots);

    let reviewHydration = useSelector((state) => state.hydration.reviews);

    let reviewHydrationId = useSelector((state) => state.hydration.id);

    let reviews = useSelector((state) => state.reviews)

    let user = useSelector((state) => state.session.user)

    // useEffect(()=> {
    //     dispatch(readReviewsBySpotThunkActionCreator(id))
    //     return null;
    // }, [])
    if (Object.values(spots).length === 0 || !spotHydration) {
        dispatch(hydrationActionCreator());
        dispatch(spotsActions.readSpotsThunkActionCreator());
        return null;
    }


//!spots[id].Owner || !spots[id].spotImages


    if (!spots[id].Owner || !spots[id].spotImages) {
        dispatch(spotsActions.readSpotByIdThunkActionCreator(id));
        return null;
    }


    console.log('reviews length: ', Object.values(reviews).length, 'reviewHydration: ', reviewHydration, 'reviewHydrationId: ', reviewHydrationId)

    if(!reviewHydration || Number(reviewHydrationId) !== Number(id)){
        dispatch(readReviewsBySpotThunkActionCreator(id))
        dispatch(reviewHydrationActionCreator(id))
        return null;
    }

    const placeHolderImage = 'https://media.istockphoto.com/id/1279117626/photo/hole-in-white-paper-with-torns-edges-coming-soon.jpg?s=1024x1024&w=is&k=20&c=D4dHftJ2zhXs7CrZjRo3m8qzagg1ncSr9HSdy_YbqY0='
    let spot = spots[id];
    console.log('spot images: ', spot.SpotImages);

    let spotArr = [];

    for (let i = 0; i < 5; i++) {
        if(spot.SpotImages[i]){
            if(spot.SpotImages[i].url && !spot.SpotImages[i].preview) spotArr.push(spot.SpotImages[i]);
            else if (spot.SpotImages[i].url && spot.SpotImages[i].preview) spot.previewImage=spot.SpotImages[i].url
        } else if (spotArr.length < 4) spotArr.push(placeHolderImage);
    }

    let reviewsArr=[];

    for(let el in reviews) {
        console.log(reviews[el]);
        if(Number(reviews[el].spotId) === Number(id)) {
            reviewsArr.push(reviews[el]);
        }
    }

    let sortedReviewsArr=[]

    console.log('sorted before while: ', sortedReviewsArr);


    while (reviewsArr.length) {
        let smallestIndex = 0
        for(let el in reviewsArr) {
            let comparisonDate = new Date(reviewsArr[el].createdAt).getTime();
            let currentNewest = new Date(reviewsArr[smallestIndex].createdAt).getTime()
            if(comparisonDate > currentNewest) {
                smallestIndex = el
            }
        }
        sortedReviewsArr.push(reviewsArr[smallestIndex]);
        reviewsArr.splice(smallestIndex, 1)
    }


    console.log('sorted arr: ', sortedReviewsArr);

    return (
        <>
        <div id={spot.id} className='spotDisplayCard' title={spot.name}>
            <img src={spot.previewImage ? spot.previewImage : placeHolderImage} alt={spot.description}></img>
            <div>{spotArr.map((spot) => {return (
                <img className='smallImages' src={spot.url ? spot.url : placeHolderImage} alt={spot.description}></img>
            )})}</div>
            <p className='spotNameText'>{spot.name}</p>
            <p className='spotDescriptionText'>Hosted By {spot.Owner.firstName} {spot.Owner.lastName}</p>
            <p className='spotDescriptionText'>Location: {spot.city}, {spot.state} {spot.country}</p>
            <p className='spotDescriptionText'>{spot.description}</p>
        </div>
        <div className='calloutInfo'>
            <p className='spotDescriptionText'>${spot.price} night</p>
            <p className='spotDescriptionText'><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}</p>
            <p className='spotDescriptionText'>{Number(sortedReviewsArr.length) ? `${sortedReviewsArr.length} ${sortedReviewsArr.length === 1 ? 'Review': 'Reviews'}`: ''}</p>
            <button onClick={() => alert('Feature coming soon')}>Reserve</button>
        </div>
        <div className='reviewsContainer'>
            <h2>Reviews</h2>
            <h3><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}</h3>
            <h3>{Number(sortedReviewsArr.length) ? `${sortedReviewsArr.length} ${sortedReviewsArr.length === 1 ? 'Review': 'Reviews'}`: ''}</h3>
                <div>
                    {sortedReviewsArr.length ? sortedReviewsArr.map((review) => {
                        let date = new Date(review.createdAt);
                        let dateString = `${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`
                        return (
                        <div>
                            <div className='reviewInfo'>{`${review.User.firstName} ${dateString}`} </div>
                            <p className='reviewText'>{review.review}</p>
                        </div>
                    )}) : null}
                </div>
                <div>{
                        (!sortedReviewsArr.length && user && spots[spot.id].Owner.id !== user.id) ? 'Be the first to post a review!':''
                    }
                </div>
        </div>
        </>
    )
}
