import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewsActions from '../../store/reviews';
import { useState } from 'react';
import { falseSpotHydrationActionCreator } from '../../store/hydration';

import './ReviewFormModal.css';



export default function ReviewFormModal (props) {
    const id = props.id;
    console.log('id: ', id);
    let user = useSelector((state) => state.session.user);
    const {closeModal} = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});


    function onSubmit (e) {
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
            if(data && data.errors) {
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
            <input type='text' value={review} onChange={(e)=>{
                setReview(e.target.value)
                console.log(review)}} placeholder='Leave your review here...'></input>
            <div className='starsContainer'>
                <button className='starButton' type="button" value={1} onClick={(e) => {setStars(Number(e.target.value))
                console.log(e.target)}}>{Number(stars) ? <i class="fas fa-solid fa-star" value={1}></i> : <i class="fa-regular fa-star" value={1}></i>}</button>
                <button className='starButton' type="button" value={2} onClick={(e) => setStars(Number(e.target.value))}>{(Number(stars) > 1) ? <i class="fas fa-solid fa-star"></i> : <i class="fa-regular fa-star"></i>}</button>
                <button className='starButton' type="button" value={3} onClick={(e) => setStars(Number(e.target.value))}>{(Number(stars) > 2) ? <i class="fas fa-solid fa-star"></i> : <i class="fa-regular fa-star"></i>}</button>
                <button className='starButton' type="button" value={4} onClick={(e) => {setStars(Number(e.target.value))
                console.log(stars)}}>{Number(stars) > 3 ? <i class="fas fa-solid fa-star"></i> : <i class="fa-regular fa-star"></i>}</button>
                <button className='starButton' type="button" value={5} onClick={(e) => setStars(Number(e.target.value))}>{(Number(stars) > 4) ? <i class="fas fa-solid fa-star"></i> : <i class="fa-regular fa-star"></i>}</button>
                <span className='descriptionText'> Stars</span>
            </div>
            <button disabled={(review.split('').length < 10 || stars < 1) ? true : false} className='deleteButton'>Submit your Review</button>
        </form>
        </>
    );
}
