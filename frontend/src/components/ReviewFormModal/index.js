import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewsActions from '../../store/reviews';
import { useState } from 'react';
import { falseSpotHydrationActionCreator } from '../../store/hydration';

import './ReviewFormModal.css';



export default function ReviewFormModal(props) {
    const id = props.id;
    console.log('id: ', id);
    let user = useSelector((state) => state.session.user);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});
    const [activeRating, setActiveRating] = useState();


    function onSubmit(e) {
        e.preventDefault();

        setErrors({});

        let formInfo = {
            review,
            stars
        }

        dispatch(reviewsActions.postReviewThunkActionCreator(formInfo, id, user))
            .then((res) => {
                console.log('res: ', res);
                // history.push(`/spots/${res.id}`);
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    console.log(errors);
                }

            });
        dispatch(falseSpotHydrationActionCreator());
        closeModal();

    }

    console.log('prereturn stars:', stars);

    return (
        <>
            <h2 className='titleText'>How was your stay?</h2>
            <div>{errors.statusCode >= 500 ? errors.message : null}</div>
            <form onSubmit={onSubmit}>
                <input type='text' value={review} onChange={(e) => {
                    setReview(e.target.value)
                    console.log(review)
                }} placeholder='Leave your review here...'></input>
                <div className='starsContainer'>
                    <div className="rating-input">
                        <div className={activeRating > 0 ? 'filled' : 'empty'} >
                            <i className="fa fa-star" onMouseEnter={() => setActiveRating(1)} onMouseLeave={() => setActiveRating(stars)} onClick={() => setStars(1)}></i>
                        </div>
                        <div className={activeRating > 1 ? 'filled' : 'empty'} >
                            <i className="fa fa-star" onMouseEnter={() => setActiveRating(2)} onMouseLeave={() => setActiveRating(stars)} onClick={() => setStars(2)}></i>
                        </div>
                        <div className={activeRating > 2 ? 'filled' : 'empty'} >
                            <i className="fa fa-star" onMouseEnter={() => setActiveRating(3)} onMouseLeave={() => setActiveRating(stars)} onClick={() => setStars(3)}></i>
                        </div>
                        <div className={activeRating > 3 ? 'filled' : 'empty'} >
                            <i className="fa fa-star" onMouseEnter={() => setActiveRating(4)} onMouseLeave={() => setActiveRating(stars)} onClick={() => setStars(4)}></i>
                        </div>
                        <div className={activeRating > 4 ? 'filled' : 'empty'} >
                            <i className="fa fa-star" onMouseEnter={() => setActiveRating(5)} onMouseLeave={() => setActiveRating(stars)} onClick={() => setStars(5)}></i>
                        </div>
                        <div className='starText descriptionText'>
                            Stars
                        </div>
                    </div>
                </div>
                <button disabled={(review.split('').length < 10 || stars < 1) ? true : false} className='deleteButton'>Submit your Review</button>
            </form>
        </>
    );
}
