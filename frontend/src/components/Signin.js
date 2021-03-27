import React, { useState } from "react";
import axios from "axios";
import "./../scss/Home.scss";

const Signin = ({ signinPopUp }) => {
  // for login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //  signin
  const handleSignin = async (evt) => {
    evt.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/users/signin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("user", JSON.stringify(data));
      if (data.status === "success") {
        window.location.replace("/");
      }
      alert("signin successful..!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className='background-box'>
      <div className='all-box signin-box'>
        <span onClick={signinPopUp} className='cross'>
          &#10005;
        </span>
        <div className='step1'>
          <h2 className='heading__secondary'>Sign In</h2>

          <form onSubmit={handleSignin} className='form__signup'>
            <input
              onChange={(evt) => setEmail(evt.target.value)}
              className='form__input custom__input'
              type='text'
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
            <button type='submit' className='btn btn-submit custom__input'>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
