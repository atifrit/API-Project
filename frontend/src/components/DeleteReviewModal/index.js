
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
            console.log('res: ', res);
        }).catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors);
            }
        });
        dispatch(falseSpotHydrationActionCreator());
        closeModal();
    }

    return (
        <>
            <h2 className='titleText'>Confirm Delete</h2>
            <p className='checkText'>Are you sure you want to delete this review?</p>
            <button onClick={denyClick} className='denyButton'>No (Keep Review)</button>
            <button onClick={deleteClick} className='deleteButton'>Yes (Delete Review)</button>
        </>
    );
}
