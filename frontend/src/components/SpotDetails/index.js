import * as spotsActions from '../../store/spots';
import { useDispatch, useSelector } from "react-redux";
import { hydrationActionCreator } from '../../store/hydration';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './SpotDetails.css'

export default function SpotDetails () {
    let dispatch = useDispatch();
    let {id} = useParams();

    let hydration = useSelector((state) => state.hydration.spots);
    // let spotHydration = useSelector((state) => state.hydration.spot);

    let spots = useSelector((state) => state.spots);

    if (Object.values(spots).length === 0 || !hydration) {
        dispatch(hydrationActionCreator());
        dispatch(spotsActions.readSpotsThunkActionCreator());
        return null;
    }



//!spots[id].Owner || !spots[id].spotImages


    if (!spots[id].Owner || !spots[id].spotImages) {
        dispatch(spotsActions.readSpotByIdThunkActionCreator(id));
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
            <button onClick={() => alert('Feature coming soon')}>Reserve</button>
        </div>
        </>
    )
}
