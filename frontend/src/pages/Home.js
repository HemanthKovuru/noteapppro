import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Signup from "./../components/Signup";
import Signin from "./../components/Signin";
import "./../scss/Home.scss";
import NoteBox from "../components/NoteBox";
import axios from "axios";

const Home = () => {
  const [signup, setSignup] = useState(false);
  const [signin, setSignin] = useState(false);
  const [note, setNote] = useState(false);
  const [mynotes, setMynotes] = useState();

  const user = JSON.parse(localStorage.getItem("user"));

  // signup popup box
  const signupPopUp = () => {
    setSignup(!signup);
  };

  // signin popup box
  const signinPopUp = () => {
    setSignin(!signin);
  };

  // upload note popup box
  const uploadNotePopUp = () => {
    setNote(!note);
  };

  // home notes

  const getMyNotes = async () => {
    try {
      const { data } = await axios.get("/api/v1/notes", {
        withCredentials: true,
      });
      console.log(data.data.notes);
      setMynotes(data.data.notes);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const callNotes = () => {
    getMyNotes();
  };

  const handleShare = (id) => {
    const str = window.location.href.split("/");
    let url = `${str[0]}//${str[2]}/api/v1/notes/${id}`;
    alert(url);
  };

  useEffect(() => {
    if (user) {
      callNotes();
    }
  }, []);

  return (
    <div>
      <Navbar
        uploadNotePopUp={uploadNotePopUp}
        signinPopUp={signinPopUp}
        signupPopUp={signupPopUp}
      />
      {signup && <Signup signupPopUp={signupPopUp} />}
      {signin && <Signin signinPopUp={signinPopUp} />}
      {note && <NoteBox uploadNotePopUp={uploadNotePopUp} />}

      {user && (
        <div className='images__container'>
          {mynotes && mynotes.length > 0 ? (
            mynotes.map((note) => (
              <div className='img__container'>
                <img src={`/images/${note.image}`} alt={note.title} />
                <div>Title: {note.title}</div>
                <div>Description: {note.content}</div>
                <button onClick={() => handleShare(note._id)}>Share</button>
              </div>
            ))
          ) : (
            <div>No Notes </div>
          )}
          <div>&nbsp;</div>
        </div>
      )}
    </div>
  );
};

export default Home;
