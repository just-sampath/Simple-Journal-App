// Required Imports
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const email = require("../utils/emails");
const crypto = require("crypto");

// Sign Token and send cookie
const signToken = async (newUser, res) => {
  let token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOpt = {
    expire: Date.now() + 1000 * 60 * 15,
    httpOnly: true,
  };
  if (process.env.NODE_ENV !== "production") cookieOpt.secure = true;
  res.cookie("jwt", token, cookieOpt);
  return token;
};

// User Registration
module.exports.register = async (req, res, next) => {
  try {
    let { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ msg: "Please enter all fields" });
    let newUser = await userModel.create({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
    if (!newUser) return res.status(400).json({ msg: "User already exists" });
    if (process.env.NODE_ENV === "production")
      res.status(200).json({ msg: "User registered successfully" });
    let token = await signToken(newUser, res);
    return res.status(200).json({
      status: "Sucess!",
      token,
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

// User Login
module.exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) return next(new Error("User does not exist"));
    user = await userModel.findOne({ email: email }).select("+password");
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Password" });
    let token = await signToken(user, res);
    res.status(200).redirect("/me");
    /*res.status(200).json({
      status: "success",
      token,
      data: user,
    });*/
  } catch (err) {
    next(err);
  }
};

// Forgot Password
module.exports.forgotPassword = async (req, res, next) => {
  try {
    if (!req.body.email) return next(new Error("Please enter your email"));
    const user = await userModule.findOne({ email: req.body.email });
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    await email({
      email: user.mail,
      subject: "Your password reset link",
      message: "Expires in 10 mins!",
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto()
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new Error("Token is invalid or has expired"));
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

// Protecting the entry routes
module.exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    if (!token) res.status(400).json({ msg: "Please login to continue" });
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) res.status(400).json({ msg: "Please login to continue" });
    let user = await userModel.findById(decoded.id);
    if (!user) res.status(400).json({ msg: "Please login to continue" });
    next(decoded.id);
  } catch (err) {
    next(err);
  }
};
