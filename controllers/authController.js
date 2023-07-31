// Required Imports
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User Registration
module.exports.register = async (req, res, next) => {
  try {
    let { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword)
      res.status(400).json({ msg: "Please enter all fields" });
    let newUser = await userModel.create({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
    if (!newUser) return res.status(400).json({ msg: "User already exists" });
    if (process.env.NODE_ENV === "production")
      res.status(200).json({ msg: "User registered successfully" });
    res.status(200).json({
      status: "Sucess!",
      token: await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }),
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
    let user = await userModel.findOne({ email: email }).select("+password");
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Password" });
    res.status(200).json({
      status: "success",
      token: await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }),
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protecting the entry routes
module.exports.protect = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer"))
      res.status(400).json({ msg: "Please login to continue" });
    let token = authHeader.split(" ")[1];
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) res.status(400).json({ msg: "Please login to continue" });
    let user = await userModel.findById(decoded.id);
    if (!user) res.status(400).json({ msg: "Please login to continue" });
    next(decoded.id);
  } catch (err) {
    next(err);
  }
};
