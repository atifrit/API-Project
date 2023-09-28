import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotsActions from '../../store/spots';
import { useHistory, useParams } from "react-router-dom";
import { hydrationActionCreator } from '../../store/hydration';

import './UpdateSpotForm.css';


export default function UpdateSpotform (props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams()

    let hydration = useSelector((state) => state.hydration.spots);

    let spots = useSelector((state) => state.spots);

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});


    if (Object.values(spots).length === 0 || !hydration) {
        dispatch(spotsActions.readSpotsThunkActionCreator());
        dispatch(hydrationActionCreator());
        return null;
    }

    let currentSpot = spots[id];

    if(hydration) {
        if(!address) {
            setAddress(`${currentSpot.address}`)
        }
        if(!country) {
            setCountry(`${currentSpot.country}`)
        }
        if(!city) {
            setCity(`${currentSpot.city}`)
        }
        if(!state) {
            setState(`${currentSpot.state}`)
        }
        if(!description) {
            setDescription(`${currentSpot.description}`)
        }
        if(!name) {
            setName(`${currentSpot.name}`)
        }
        if(!price) {
            setPrice(`${currentSpot.price}`)
        }
    }


    function onSubmit (e) {
        e.preventDefault();

        setErrors({});

        let formInfo = {
            country,
            address,
            city,
            state,
            description,
            name,
            price,
        }

        dispatch(spotsActions.updateSpotThunkActionCreator(formInfo, id))
        .then((res) => {
            history.push(`/spots/${id}`);
        })
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors);
            }
        });


    }
    return (
        <>
            <h2 className='titleText'>Create a New Spot</h2>
            <form onSubmit={onSubmit}>
                <div className='formSection'>
                    <h2 className='subtitleText'>Where's your place located?</h2>
                    <p className='subheadingText'>Guests will only get your exact address once they booked a reservation.</p>
                    <label htmlFor='countryInput'>Country</label>
                    <input id='countryInput' type='text' placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)}></input>
                    <p className='errors'>{errors.country ? errors.country : ''}</p>
                    <label htmlFor='streetInput'>Street Address</label>
                    <input id='streetInput' type='text' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)}></input>
                    <p className='errors'>{errors.address ? errors.address : ''}</p>
                    <div className='cityState'>
                        <label htmlFor='cityInput'>City</label>
                        <input id='cityInput' type='text' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)}></input>
                        <p className='errors'>{errors.city ? errors.city : ''}</p>
                        <span> , </span>
                        <label htmlFor='stateInput'>State</label>
                        <input id='stateInput' type='text' placeholder='STATE' value={state} onChange={(e) => setState(e.target.value)}></input>
                        <p className='errors'>{errors.state ? errors.state : ''}</p>
                    </div>
                </div>
                <div className='formSection'>
                    <h2 className='subtitleText'>Describe your place to guests</h2>
                    <p className='subheadingText'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea id='descriptionText' placeholder='Please write at least 30 characters' value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
                    <p className='errors'>{errors.description ? errors.description : ''}</p>
                </div>
                <div className='formSection'>
                    <h2 className='subtitleText'>Create a title for your spot</h2>
                    <p className='subheadingText'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input type='text' placeholder='Name of your spot' value={name} onChange={(e) => setName(e.target.value)}></input>
                    <p className='errors'>{errors.name ? errors.name : ''}</p>
                </div>
                <div className='formSection'>
                    <h2 className='subtitleText'>Set a base price for your spot</h2>
                    <p className='subheadingText'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label htmlFor='priceInput'>$</label>
                    <input id='priceInput' type='number' placeholder='Price per night (USD)' value={price} onChange={(e) => setPrice(e.target.value)}></input>
                    <p className='errors'>{errors.price ? errors.price : ''}</p>
                </div>

                <button className='submitButton'>Update Spot</button>
            </form>
        </>

    )
}
