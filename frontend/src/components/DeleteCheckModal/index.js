
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import './DeleteCheckModal.css'
import { deleteSpotThunkActionCreator } from '../../store/spots';
import { useState } from 'react';



export default function DeleteCheckModal (props) {
    const {closeModal} = useModal();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});

    function denyClick (e) {
        closeModal();
    }

    function deleteClick () {
        dispatch(deleteSpotThunkActionCreator(props.id))
        .then((res) => {
            console.log('res: ', res);
        }).catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors);
            }
        });
        closeModal();
    }

    return (
        <div className='deleteModalPopup'>
            <h2 className='deleteTitleText'>Confirm Delete</h2>
            <p className='checkText'>Are you sure you want to remove this spot?</p>
            <button onClick={deleteClick} className='deleteButton'>Yes (Delete Spot)</button>
            <button onClick={denyClick} className='denyButton'>No (Keep Spot)</button>
        </div>
    );
}
