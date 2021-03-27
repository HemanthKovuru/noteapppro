import axios from "axios";
import React, { useState } from "react";

const NoteBox = ({ uploadNotePopUp }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // upload image function
  const createNote = async (evt) => {
    evt.preventDefault();
    let form = new FormData();
    // let title = document.getElementById("name").value;
    console.log(title);
    // let content = document.getElementById("content").value;
    let image = document.getElementById("file").files[0];
    if (title) {
      form.append("title", title);
    }
    if (content) {
      form.append("content", content);
    }
    if (image) {
      form.append("image", image);
    }

    try {
      const res = await axios.post("/api/v1/notes", form, {
        withCredentials: true,
      });
      if (res.data.status === "success") {
        alert("note created.");
        window.location.reload();
      }
    } catch (err) {
      alert(err.response.data.message);
      console.log(err.response);
    }
  };

  return (
    <div className='background-box'>
      <div className='all-box note-box'>
        <span onClick={uploadNotePopUp} className='cross'>
          &#10005;
        </span>
        <div className='step1'>
          <h2 className='heading__secondary'>Create Note</h2>

          <form onSubmit={createNote} className='form__signup'>
            <input
              id='title'
              onChange={(evt) => setTitle(evt.target.value)}
              className='form__input custom__input'
              type='text'
              placeholder='Title'
            />
            <input
              id='content'
              onChange={(evt) => setContent(evt.target.value)}
              className='form__input custom__input'
              type='text'
              placeholder='Description'
            />
            <input
              id='file'
              className='form__input custom__input'
              type='file'
            />
            <button type='submit' className='btn btn-submit custom__input'>
              Create Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteBox;
