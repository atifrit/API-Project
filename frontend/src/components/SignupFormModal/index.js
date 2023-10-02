import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1 className="loginTitle">Sign Up</h1>
      <form onSubmit={handleSubmit} className='signInContainer'>
        <label>

          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
            className='loginInput'
          />
        </label>
        <label>

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder='Last Name'
            className='loginInput'
          />
        </label>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email'
            className='loginInput'
          />
        </label>
        {errors.email && <p className='errors'>{errors.email}</p>}
        <label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Username'
            className='loginInput'
          />
        </label>
        {errors.username && <p className='errors'>{errors.username}</p>}
        {errors.firstName && <p className='errors'>{errors.firstName}</p>}
        {errors.lastName && <p className='errors'>{errors.lastName}</p>}
        <label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            className='loginInput'
          />
        </label>
        {errors.password && <p className='errors'>{errors.password}</p>}
        <label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm Password'
            className='loginInput'
          />
        </label>
        {errors.confirmPassword && (
          <p className='errors'>{errors.confirmPassword}</p>
        )}
        <button className='loginButton' type="submit" disabled={(!email || !username || !firstName || !lastName || !password || !confirmPassword || username.split('').length < 4 || password.split('').length < 6) ? true : false}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
