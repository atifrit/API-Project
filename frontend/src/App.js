import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SpotDetails from './components/SpotDetails';
import CreateSpotForm from './components/CreateSpotForm';
import UserSpots from "./components/UserSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path='/'><HomePage /></Route>
        <Route exact path='/spots/new'><CreateSpotForm /></Route>
        <Route exact path='/spots/current'><UserSpots /></Route>
        <Route exact path='/spots/:id'><SpotDetails /></Route>
      </Switch>}
    </>
  );
}

export default App;
