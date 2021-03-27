const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");

// middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// body parser
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

// static files
app.use(express.static(`${__dirname}/public`));

// routes
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/users", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.all("/", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// global error handler
app.use((err, req, res, next) => {
  err.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
  });
});

module.exports = app;
