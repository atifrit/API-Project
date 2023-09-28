
import { useModal } from '../../context/Modal';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './DeleteCheckModal.css'
import { deleteSpotThunkActionCreator } from '../../store/spots';
import { useState } from 'react';



export default function DeleteCheckModal (props) {
    const history = useHistory();
    const {closeModal} = useModal();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});

    function denyClick (e) {
        closeModal();
    }

    function deleteClick () {
        console.log(props.id);dispatch(deleteSpotThunkActionCreator(props.id))
        .then((res) => {
            console.log('res: ', res);
        }).catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
            }
        });
        closeModal();
    }

    return (
        <>
            <h2 className='titleText'>Confirm Delete</h2>
            <p className='checkText'>Are you sure you want to delete this spot?</p>
            <button onClick={denyClick} className='denyButton'>No (Keep Spot)</button>
            <button onClick={deleteClick} className='deleteButton'>Yes (Delete Spot)</button>
        </>
    );
}
