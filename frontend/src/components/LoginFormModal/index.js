import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  function demoUser () {
    return dispatch(sessionActions.login({ credential:'Demo-lition', password:'password' }))
    .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  return (
    <>
      <h1 className='loginTitle'>Log In</h1>
      <form onSubmit={handleSubmit} className='inputContainer'>
        <label className='errorLabel'>
          {errors.credential && (
            <p>{errors.credential}</p>
          )}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
            className="loginInput"
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="loginInput"
          />
        </label>
        <button className='loginButton' type="submit" disabled={(credential.split('').length < 4 || password.split('').length < 6) ? true : false}>Log In</button>
      </form>
      <button onClick={demoUser} className="demoUserButton">Log in as a Demo User</button>
    </>
  );
}

export default LoginFormModal;
