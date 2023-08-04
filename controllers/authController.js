// Required Imports
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const email = require("../utils/emails");
const crypto = require("crypto");
const session = require("express-session");

// Sign Token and send cookie
const signToken = async (newUser, res) => {
  // Creating the jwt token
  let token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Setting the cookie options
  const cookieOpt = {
    expire: Date.now() + 1000 * 60 * 15,
    httpOnly: true,
  };

  // Setting the cookie for production
  if (process.env.NODE_ENV !== "production") cookieOpt.secure = true;

  // Sending the cookie
  res.cookie("jwt", token, cookieOpt);
  return token;
};

// User Registration
module.exports.register = async (req, res, next) => {
  try {
    // Getting Details
    let { name, email, password, confirmPassword } = req.body;

    // Creating the user
    let newUser = await userModel.create({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });

    // Generating the token and sending the cookie
    let token = await signToken(newUser, res);

    // Handling for development
    res.redirect("/entries");
    /*return res.status(200).json({
      status: "Sucess!",
      token,
      data: newUser,
    });*/
  } catch (err) {
    next(new Error("User already exists!"));
  }
};

// User Login
module.exports.login = async (req, res, next) => {
  try {
    // Getting Details
    let { email, password } = req.body;

    // Checking if the user exists
    let user = await userModel.findOne({ email: email });
    if (!user) return next(new Error("User does not exist"));

    // Checking if the password is correct
    user = await userModel.findOne({ email: email }).select("+password");
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error("Invalid Password"));

    // Generating the token and sending the cookie
    let token = await signToken(user, res);

    // Handling the route
    res.status(200).redirect("/entries");
    /*res.status(200).json({
      status: "success",
      token,
      data: user,
    });*/
  } catch (err) {
    next(new Error("Please Check your credentials!"));
  }
};

// Sending the password reset token
module.exports.forgotPassword = async (req, res, next) => {
  try {
    // Getting the user
    if (!req.body.email) return next(new Error("Please enter your email"));

    // Checking if the user exists
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return next(new Error("User does not exist"));

    // Creating password reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // Saving the user without validation
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;

    // Sending the email
    const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    await email({
      email: user.email,
      subject: "Your password reset link",
      message,
    });

    // Sending the response
    res.status(200).redirect("/login");
    /*res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });*/
  } catch (err) {
    next(err);
  }
};

// Resetting the password
module.exports.resetPassword = async (req, res, next) => {
  // Creating a hashed token
  const hashedToken = crypto()
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Finding the user
  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Checking if the user exists
  if (!user) return next(new Error("Token is invalid or has expired"));

  // Setting the new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Sending the response
  res.status(200).redirect("/login");
};

// Logout
module.exports.logout = async (req, res, next) => {
  try {
    // Clearing the cookie
    res.clearCookie("jwt");

    // Sending the response
    res.status(200).redirect("/login");
    /*res.status(200).json({
      status: "Success",
    });*/
  } catch (err) {
    next(err);
  }
};

// Protecting the entry routes
module.exports.protect = async (req, res, next) => {
  try {
    // Getting the token from the cookie
    let token = req.cookies.jwt;
    if (!token)
      return res
        .status(400)
        .render("error", { err: new Error("Please login!") });

    // Verifying the token
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res
        .status(400)
        .render("error", { err: new Error("Please login!") });

    // Checking if the user exists
    let user = await userModel.findById(decoded.id);
    if (!user)
      return res
        .status(400)
        .render("error", { err: new Error("Please login!") });

    // Checking if the user changed the password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) return;

    // Sending the id to the next middleware
    next(decoded.id);
  } catch (err) {
    next(new Error("Authentication Error!"));
  }
};
