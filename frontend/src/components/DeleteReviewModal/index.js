
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import './DeleteReviewModal.css'
import { deleteReviewThunkActionCreator } from '../../store/reviews';
import { useState } from 'react';
import { falseSpotHydrationActionCreator } from '../../store/hydration';



export default function DeleteReviewModal (props) {
    const {closeModal} = useModal();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});

    function denyClick (e) {
        closeModal();
    }

    function deleteClick () {
        dispatch(deleteReviewThunkActionCreator(props.id))
        .then((res) => {
        }).catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
            }
        });
        dispatch(falseSpotHydrationActionCreator());
        closeModal();
    }

    return (
        <div className='deleteModalPopup'>
            <h2 className='deleteReviewTitleText'>Confirm Delete</h2>
            <p className='checkText'>Are you sure you want to delete this review?</p>
            <button onClick={deleteClick} className='deleteButton'>Yes (Delete Review)</button>
            <button onClick={denyClick} className='denyButton'>No (Keep Review)</button>
        </div>
    );
}
