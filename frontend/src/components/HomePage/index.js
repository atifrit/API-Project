import * as spotsActions from '../../store/spots';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { hydrationActionCreator } from '../../store/hydration';

import './HomePage.css'

// {spotsArr.map((spot) => {return (
//     <div>
//         <img src={spot.previewImage ? spot.previewImage : null} alt={spot.description}></img>
//         <p className='spotNameText'>{spot.name}</p>
//         <p className='spotDescriptionText'>{spot.description}</p>
//     </div>
//     )})}


function HomePage (props) {
    const dispatch = useDispatch();


    let hydration = useSelector((state) => state.hydration.spots);

    let spots = useSelector((state) => state.spots);

    if (Object.values(spots).length === 0 || !hydration) {
        dispatch(hydrationActionCreator());
        dispatch(spotsActions.readSpotsThunkActionCreator());
    }

    let history = useHistory();

    function onClick (e) {
        if(e.target.id){
            history.push(`/spots/${e.target.id}`)
        } else history.push(`/spots/${e.target.parentElement.id}`);
    }

    return (
        <>
        <div className='homePageSpots'>
            {Object.values(spots).map((spot) => {
                return (
                    <div id={spot.id} className='spotDisplayCard toolTip' onClick={onClick}>
                        <span className='toolTipText'>{spot.name}</span>
                        <img src={spot.previewImage ? spot.previewImage : 'placeHolder'} alt={spot.description}></img>
                        <p className='spotNameText'>{spot.name}</p>
                        <p className='spotDescriptionText'><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating : 'New'}</p>
                        <p className='spotDescriptionText'>{spot.city}, {spot.state}</p>
                        <p className='spotDescriptionText'>{spot.description}</p>
                        <p className='spotDescriptionText'>${spot.price} night</p>
                    </div>
                )
            })}
        </div>
        </>
    )
}


export default HomePage
