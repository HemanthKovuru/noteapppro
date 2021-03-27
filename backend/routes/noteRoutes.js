const express = require("express");
const noteController = require("./../controllers/notecontroller");
const authController = require("./../controllers/authController");
const router = express.Router();

router.get("/:query", noteController.search);
router.use(authController.access);

router
  .route("/")
  .get(noteController.getAllNotes)
  .post(noteController.addImage, noteController.createNote);

router
  .route("/:id")
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;
