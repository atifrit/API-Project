import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navbar'>
      <ul className='navbarList'>
        <li className='logoListEl'>
          <NavLink exact to="/"><img className='logo' src='https://cdn.icon-icons.com/icons2/836/PNG/512/Airbnb_icon-icons.com_66791.png' alt='logo'></img></NavLink>
        </li>
        {isLoaded && (
          <li  className='navbarListEl'>
            <NavLink exact to="/spots/new" hidden={sessionUser ? false: true} className='createSpotLink'>Create a New Spot</NavLink>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
