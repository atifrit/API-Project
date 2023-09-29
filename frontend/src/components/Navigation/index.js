import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to="/"><img className='logo' src='https://cdn.icon-icons.com/icons2/836/PNG/512/Airbnb_icon-icons.com_66791.png' alt='logo'></img></NavLink>
        <NavLink exact to="/spots/new">Create a New Spot</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
