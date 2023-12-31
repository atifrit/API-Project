import * as spotsActions from '../../store/spots';
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrationActionCreator } from '../../store/hydration';
import { useParams } from 'react-router-dom';
import { readReviewsBySpotThunkActionCreator } from '../../store/reviews';
import { reviewHydrationActionCreator } from '../../store/hydration';
import OpenModalButton from '../OpenModalButton';
import ReviewFormModal from '../ReviewFormModal';
import DeleteReviewModal from '../DeleteReviewModal';
import './SpotDetails.css';

export default function SpotDetails() {
    let dispatch = useDispatch();

    let { id } = useParams();

    let spotHydration = useSelector((state) => state.hydration.spots);

    let spots = useSelector((state) => state.spots);

    let reviewHydration = useSelector((state) => state.hydration.reviews);

    let reviewHydrationId = useSelector((state) => state.hydration.id);

    let reviews = useSelector((state) => state.reviews)

    let user = useSelector((state) => state.session.user)

    const [showMenu, setShowMenu] = useState(false);

    const ulRef = useRef();
    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

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



    if (!reviewHydration || Number(reviewHydrationId) !== Number(id)) {
        dispatch(readReviewsBySpotThunkActionCreator(id))
        dispatch(reviewHydrationActionCreator(id))
        return null;
    }



    const closeMenu = () => setShowMenu(false);



    const placeHolderImage = 'https://media.istockphoto.com/id/1279117626/photo/hole-in-white-paper-with-torns-edges-coming-soon.jpg?s=1024x1024&w=is&k=20&c=D4dHftJ2zhXs7CrZjRo3m8qzagg1ncSr9HSdy_YbqY0='
    let spot = spots[id];

    let spotArr = [];

    for (let i = 0; i < 5; i++) {

        if (spot.SpotImages[i]) {
            if (!spot.SpotImages[i].preview)
            {
                spotArr.push(spot.SpotImages[i].url);
            } else if (spot.SpotImages[i].url && spot.SpotImages[i].preview) {
                spot.previewImage = spot.SpotImages[i].url
            }
        } else if (spotArr.length < 4) {
            spotArr.push(placeHolderImage);
        }
    }


    let reviewsArr = [];

    for (let el in reviews) {
        if (Number(reviews[el].spotId) === Number(id)) {
            reviewsArr.push(reviews[el]);
        }
    }

    let sortedReviewsArr = [];
    let reviewCheck = false;



    while (reviewsArr.length) {
        let smallestIndex = 0
        for (let el in reviewsArr) {
            let comparisonDate = new Date(reviewsArr[el].createdAt).getTime();
            let currentNewest = new Date(reviewsArr[smallestIndex].createdAt).getTime()
            if (comparisonDate > currentNewest) {
                smallestIndex = el
            }
            if (user) {
                if (reviewsArr[el].userId === user.id) {
                    reviewCheck = true
                }
            }
        }
        sortedReviewsArr.push(reviewsArr[smallestIndex]);
        reviewsArr.splice(smallestIndex, 1)
    }



    return (
        <>
            <div id={spot.id} className='spotInfo' title={spot.name}>
                <p className='spotNameText'>{spot.name}</p>
                <p className='descriptionText mover'>{spot.city}, {spot.state}, {spot.country}</p>
                <div className='spotImagesContainer'>
                    <img className='bigImage' src={spot.previewImage ? spot.previewImage : placeHolderImage} alt={spot.description}></img>
                    <div className='smallImagesContainer'>{spotArr.map((spot) => {
                        return (
                            <img className='smallImages' src={spot} alt={spot.description}></img>
                        )
                    })}</div>
                </div>
                <div className='subheading'>
                    <div>
                        <p className='hostText'>Hosted By {spot.Owner.firstName} {spot.Owner.lastName}</p>
                        <p className='descriptionText'>{spot.description}</p>
                    </div>
                    <div className='calloutInfo'>
                        <div className='calloutReviewInfo'>
                            <p className='priceText'>${spot.price} <span className='spotDescriptionText'>night</span></p>
                            <div className='ratingContainer'>
                                <p className='spotDescriptionText'><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}</p>
                                <p>{Number(sortedReviewsArr.length) ? <i class="fas fa-solid fa-circle"></i> : null}</p>
                                <p className='spotDescriptionText'>{Number(sortedReviewsArr.length) ? `${sortedReviewsArr.length} ${sortedReviewsArr.length === 1 ? 'Review' : 'Reviews'}` : null}</p>
                            </div>
                        </div>
                        <button onClick={() => alert('Feature coming soon')} className='reserveButton'>Reserve</button>
                    </div>
                </div>
                <div id="box">
                    <div id="borderBottom"></div>
                </div>
            </div>


            <div className='reviewsContainer'>
                <div id='reviewHeader'>
                    <h3 className='headerMove'><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}</h3>
                    <div hidden={sortedReviewsArr.length ? false : true}><i class="fas fa-solid fa-circle"></i></div>
                    <h3 className='headerMove'>{Number(sortedReviewsArr.length) ? `${sortedReviewsArr.length} ${sortedReviewsArr.length === 1 ? 'Review' : 'Reviews'}` : null}</h3>
                </div>
                <div>{(!reviewCheck && user && spots[spot.id].Owner.id !== user.id) ? <OpenModalButton
                    buttonText="Post your Review"
                    onButtonClick={closeMenu}
                    modalComponent={<ReviewFormModal id={spot.id} user={user} />}
                    className='postReviewButton'
                /> : null}</div>
                <div>
                    {sortedReviewsArr.length ? sortedReviewsArr.map((review) => {
                        let date = new Date(review.createdAt);
                        let dateString = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
                        return (
                            <div>
                                <div className='reviewInfo'>{`${review.User.firstName}`} </div>
                                <div className='dateInfo'>{`${dateString}`} </div>
                                <p className='reviewText'>{review.review}</p>
                                <div hidden={(!user || !(user.id === review.User.id)) ? true : false} className='deleteButtonContainer'>{<OpenModalButton
                                    buttonText="Delete"
                                    onButtonClick={closeMenu}
                                    modalComponent={<DeleteReviewModal id={review.id} />}
                                    className='deleteReviewButton'
                                />}</div>
                                {/* <button hidden={user.id === review.User.id ? false:true}>Delete Review</button> */}
                            </div>
                        )
                    }) : null}
                </div>
                <div className='postNew'>{
                    (!sortedReviewsArr.length && user && spots[spot.id].Owner.id !== user.id) ? 'Be the first to post a review!' : ''
                }
                </div>
            </div>
        </>
    )
}
