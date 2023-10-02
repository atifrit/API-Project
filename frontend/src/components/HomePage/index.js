import * as spotsActions from '../../store/spots';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { hydrationActionCreator } from '../../store/hydration';

import './HomePage.css'

// {spotsArr.map((spot) => {return (
//     <div>
//         <img src={spot.previewImage ? spot.previewImage : null} alt={spot.description}></img>
//         <p className='spotNameText'>{spot.name}</p>
//         <p className='spotDescriptionText'>{spot.description}</p>
//     </div>
//     )})}

const placeHolderImage = 'https://media.istockphoto.com/id/1279117626/photo/hole-in-white-paper-with-torns-edges-coming-soon.jpg?s=1024x1024&w=is&k=20&c=D4dHftJ2zhXs7CrZjRo3m8qzagg1ncSr9HSdy_YbqY0='

function HomePage(props) {

    const dispatch = useDispatch();

    let hydration = useSelector((state) => state.hydration.spots);

    let spots = useSelector((state) => state.spots);

    if (Object.values(spots).length === 0 || !hydration) {
        dispatch(hydrationActionCreator());
        dispatch(spotsActions.readSpotsThunkActionCreator());
    }



    return (
        <>
            <div className='homePageSpots'>
                {Object.values(spots).map((spot) => {
                    return (
                        <Link className='homeLinks' to={`/spots/${spot.id}`} >
                            <div id={spot.id} className='spotDisplayCard' title={spot.name}>
                                <img src={spot.previewImage ? spot.previewImage : placeHolderImage} alt={spot.description}></img>
                                <div className='location'>
                                    <p className='spotDescriptionText'>{spot.city}, {spot.state}</p>
                                    <p className='spotDescriptionText spotRating'><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}</p>
                                </div>
                                <p className='spotDescriptionText'>${spot.price} night</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}


export default HomePage
