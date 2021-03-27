import axios from "axios";
import React from "react";
import "./../scss/Navbar.scss";

const Navbar = ({ signupPopUp, signinPopUp, uploadNotePopUp }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // signout
  const handleSignOut = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/signout");
      console.log(data);

      if (data.status === "success") {
        localStorage.removeItem("user");
        alert(data.message);
        window.location.reload();
      }
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  // handleChange
  const handleChange = async (evt) => {
    console.log(evt.target.value);
  };

  return (
    <div className='navbar__container'>
      <div className='navbar'>
        {!user ? (
          <>
            <div className='logo'>
              <span className='btn btn-note'>Welcome</span>
            </div>
            {/* <div className='search__box'></div> */}
            <div className='navbar__right2'>
              <span onClick={signinPopUp} className='btn btn-signup'>
                Sign In
              </span>
              <span onClick={signupPopUp} className='btn btn-signup'>
                Sign Up
              </span>
            </div>
          </>
        ) : (
          <>
            <div onClick={uploadNotePopUp} className='logo'>
              <span className='btn btn-note'>Create a note</span>
            </div>
            <div className='search__box'>
              <input
                onChange={handleChange}
                placeholder='Search for your notes'
                className='search_field'
                type='text'
              />
            </div>
            <div className='navbar__right1'>
              <span>Hemanth</span>
              <span onClick={handleSignOut} className='btn btn-signup'>
                Signout
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
