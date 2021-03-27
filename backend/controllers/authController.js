const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const asyncError = require("./../utils/asyncError");
const GlobalError = require("./../utils/globalError");

// create token
const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// create and send token
const sendToken = (user, statusCode, res) => {
  const token = getToken(user._id);

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN + 24 * 60 * 60 * 1000
    ),
  });

  user.password = undefined;
  user.__v = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = asyncError(async (req, res, next) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
  });

  // send response and token
  sendToken(user, 200, res);
});

exports.signin = asyncError(async (req, res, next) => {
  // check if there is email and password
  const { password, email } = req.body;
  if (!password || !email) {
    return next(new GlobalError("Please provide email and password"));
  }

  // check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new GlobalError("Incorrect  email or password"));
  }

  // send token
  sendToken(user, 200, res);
});

// signout
exports.signout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      message: "Logged out successfull",
    });
  } catch (err) {
    return next(new GlobalError("logout failed", 400));
  }
};

exports.access = asyncError(async (req, res, next) => {
  // 1). check if there is a token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new GlobalError("Please login to get access.", 401));
  }
  // 2). verify jwt
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3). check if user exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new GlobalError("user no longer exist.", 401));
  }

  // 4). check if the user changed password after the token has issued
  if (user.checkPassAfterToken(decoded.iat)) {
    return next(
      new GlobalError(
        "User recently changed password. Please login again.",
        401
      )
    );
  }

  // grant access
  req.user = user;
  next();
});
