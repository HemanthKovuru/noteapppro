const multer = require("multer");
const asyncError = require("../utils/asyncError");
const GlobalError = require("./../utils/GlobalError");
const Note = require("../models/noteModel");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    let err = new Error("please upload images only");
    err.statusCode = 400;
    cb(new Error(err));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.addImage = upload.single("image");

exports.search = asyncError(async (req, res, next) => {
  console.log("query", req.query.query);

  const results = await Note.find({ $text: { $search: req.query.query } });
  console.log(results);

  res.status(200).json({
    status: "success",
    data: {
      results,
    },
  });
});

exports.getAllNotes = asyncError(async (req, res, next) => {
  const notes = await Note.find({ user: req.user.id });

  res.status(200).json({
    status: "success",
    data: {
      notes,
    },
  });
});

exports.createNote = asyncError(async (req, res, next) => {
  // create an image
  console.log(req.file);
  if (req.file) {
    req.body.image = req.file.filename;
  }

  req.body.user = req.user.id;

  const note = await Note.create(req.body);

  if (!note) {
    return next(
      new GlobalError("an error occured while creating the document", 400)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

exports.updateNote = asyncError(async (req, res, next) => {
  console.log(req.params.id);
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!note) {
    return next(new GlobalError("document not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

exports.deleteNote = asyncError(async (req, res, next) => {
  const note = await Note.findByIdAndDelete(req.params.id);

  if (!note) {
    return next(new GlobalError("document not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getNote = asyncError(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new GlobalError("document not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});
