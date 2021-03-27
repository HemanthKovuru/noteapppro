const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    unique: true,
  },
  content: {
    type: String,
    required: [true, "Plewase provide a description"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Please provide a image"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide a user id."],
  },
});

noteSchema.index({ title: "text", content: "text" });

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
