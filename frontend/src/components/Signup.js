import React, { useState } from "react";
import axios from "axios";
import "./../scss/Home.scss";

const Signup = ({ signupPopUp }) => {
  // for signup state
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // signup
  const handleSignup = async (evt) => {
    evt.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/users/signup",
        {
          firstname,
          lastname,
          email,
          password,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("user", JSON.stringify(data));
      if (data.status === "success") {
        window.location.replace("/");
      }
      alert("signup successful..!");
    } catch (err) {
      alert(err.response.data.message);
      console.log(err.response);
    }
  };

  return (
    <div className='background-box'>
      <div className='all-box signup-box'>
        <span onClick={signupPopUp} className='cross'>
          &#10005;
        </span>
        <div className='step1'>
          <h2 className='heading__secondary'>Sign Up</h2>
          <div className='heading__sub'>It's quick and easy</div>

          <form onSubmit={handleSignup} className='form__signup'>
            <input
              onChange={(evt) => setFirstname(evt.target.value)}
              className='form__input'
              type='text'
              placeholder='First Name'
              required
            />
            <input
              onChange={(evt) => setLastname(evt.target.value)}
              className='form__input'
              type='text'
              placeholder='Last Name'
              required
            />
            <input
              onChange={(evt) => setEmail(evt.target.value)}
              className='form__input custom__input'
              type='email'
              placeholder='Email'
              required
            />
            <input
              onChange={(evt) => setPassword(evt.target.value)}
              className='form__input custom__input'
              type='password'
              placeholder='Password'
              required
            />
            <input
              onChange={(evt) => setConfirmPassword(evt.target.value)}
              className='form__input custom__input'
              type='password'
              placeholder='Confirm Password'
              required
            />
            <button type='submit' className='btn btn-submit custom__input'>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
