import React, { useState, useEffect, useRef } from "react";
import * as spotsActions from '../../store/spots';
import { useDispatch, useSelector } from "react-redux";
import { hydrationActionCreator } from '../../store/hydration';
import { Link } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import DeleteCheckModal from '../DeleteCheckModal';
import { useHistory } from 'react-router-dom';
import './UserSpots.css'

const placeHolderImage = 'https://media.istockphoto.com/id/1279117626/photo/hole-in-white-paper-with-torns-edges-coming-soon.jpg?s=1024x1024&w=is&k=20&c=D4dHftJ2zhXs7CrZjRo3m8qzagg1ncSr9HSdy_YbqY0=';

export default function UserSpots(props) {
    const dispatch = useDispatch();

    const history = useHistory()

    let user = useSelector((state) => state.session.user);

    let hydration = useSelector((state) => state.hydration.spots);

    let spots = useSelector((state) => state.spots);

    if (Object.values(spots).length === 0 || !hydration) {
        dispatch(hydrationActionCreator());
        dispatch(spotsActions.readSpotsThunkActionCreator());
    }

    const userSpots = [];
    if (user) {
        for (let spot of Object.values(spots)) {
            if (spot.ownerId === user.id) {
                userSpots.push(spot);
            }
        }
    }


    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();



    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);


    if (userSpots.length) {
        return (
            <>
                <h2 className='manageSpotsTitleText'>Manage Spots</h2>
                <div className='homePageSpots'>
                    {userSpots.map((spot) => {
                        return (
                            <div className='spotContainer'>
                                <Link className='manageLinks' to={`/spots/${spot.id}`} >
                                    <div id={spot.id} className='spotDisplayCard' title={spot.name}>
                                        <img src={spot.previewImage ? spot.previewImage : placeHolderImage} alt={spot.description}></img>
                                        <div className='cityStateRate'>
                                            <p className='spotDescriptionText'>{spot.city}, {spot.state}</p>
                                            <p className='spotDescriptionText'><i class="fas fa-solid fa-star" /> {spot.avgRating ? spot.avgRating : 'New'}</p>
                                        </div>
                                        <p className='spotDescriptionText'>${spot.price} night</p>
                                    </div>
                                </Link>
                                <div className='userSpotsButtons'>
                                    <button className='manageButtons' id={spot.id} onClick={(e) => { history.push(`/spots/${e.target.id}/edit`) }}>Update</button>
                                    <OpenModalButton
                                        buttonText="Delete"
                                        onButtonClick={closeMenu}
                                        modalComponent={<DeleteCheckModal id={spot.id} />}
                                        className='manageButtons'
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    } else {
        return (
            <>
                <h2 className='manageSpotsTitleText'>Manage Spots</h2>
                <div className='newSpotLinkContainer'>
                    <Link className='newSpotLink' exact to='/spots/new'>Create a New Spot</Link>
                </div>
            </>
        )
    }

}
