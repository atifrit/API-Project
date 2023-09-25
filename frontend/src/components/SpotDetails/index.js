import * as spotsActions from '../../store/spots';
import { useDispatch, useSelector } from "react-redux";
import { hydrationActionCreator } from '../../store/hydration';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './SpotDetails.css'

export default function SpotDetails () {
    let dispatch = useDispatch();
    let {id} = useParams();

    let hydration = useSelector((state) => state.hydration.spots);

    let spots = useSelector((state) => state.spots);

    if (Object.values(spots).length === 0 || !hydration) {
        dispatch(hydrationActionCreator());
        dispatch(spotsActions.readSpotsThunkActionCreator());
    }


    let spot = spots[id];

    return (
        <div id={spot.id} className='spotDisplayCard toolTip'>
            <span className='toolTipText'>{spot.name}</span>
            <img src={spot.previewImage ? spot.previewImage : 'placeHolder'} alt={spot.description}></img>
            <p className='spotNameText'>{spot.name}</p>
            <p className='spotDescriptionText'><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating : 'New'}</p>
            <p className='spotDescriptionText'>{spot.city}, {spot.state}</p>
            <p className='spotDescriptionText'>{spot.description}</p>
            <p className='spotDescriptionText'>${spot.price} night</p>
        </div>
    )
}
