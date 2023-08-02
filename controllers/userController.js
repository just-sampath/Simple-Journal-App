// Required Imports
const userModel = require("../models/userModel");
const entryModel = require("../models/entryModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Update
module.exports.userUpdate = async (id, req, res, next) => {
  try {
    // Getting the name and email from the body
    const { name, email } = req.body;

    // Updating the user
    const user = await userModel.findById(id);

    if (name) user.name = name;
    if (email) {
      if (!userModel.find({ email: email })) {
        user.email = email;
      } else {
        throw new Error("Email already exists");
      }
    }

    // Saving the user
    try {
      user.save();
    } catch (err) {
      console.log(err.message);
    }
    // Sending the response
    res.redirect("/me");
    /*res.status(200).json({
      status: "Success",
      data: user,
    });*/
  } catch (err) {
    next(err);
  }
};

// User Delete
module.exports.userDelete = async (id, req, res, next) => {
  try {
    // Getting user details
    let user = await userModel.findById(id).select("+password");

    // Getting the password
    let { password } = req.body;
    let isMatch = await bcrypt.compare(password, user.password);

    //Checking if passwords are a match
    if (!isMatch) throw new Error("Not a valid password");

    // Deleting all the entries of the user
    let deletedEntires = await entryModel.deleteMany({ parent: id });

    // Deleting the user
    let deleted = await userModel.findByIdAndDelete(id);

    // Sending the response
    res.status(200).json({
      status: "Success",
      data: {
        deletedUser: deleted,
        deletedData: deletedEntires,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Change Password
module.exports.changePassword = async (id, req, res, next) => {
  try {
    // Getting the user
    const user = await userModel.findById(id).select("+password");

    // Getting the passwords from the body
    let { password, newPassword, confirmPassword } = req.body;

    // Checking if the new passwords match
    if (newPassword !== confirmPassword)
      throw new Error("New Password and Confirm Password don't match");

    // Checking if the password is correct
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Not a valid password");

    // Updating the password
    user.password = newPassword;
    user.confirmPassword = newPassword;
    await user.save();

    // Sending the response
    res.redirect("/logout");
    /*res.status(200).json({
      status: "Success",
      data: user,
    });*/
  } catch (err) {
    next(err);
  }
};

const userExists = async (req) => {
  try {
    // Getting the token
    let token = req.cookies.jwt;

    // If there is no token, return false
    if (!token) return false;

    // Checking if the token exists
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Getting the user
    let user = await userModel.findById(decoded.id);

    // Checking if the password has been changed
    let isChanged = await user.changedPasswordAfter(decoded.iat);

    // Redirecting to the home page if the user is logged in
    return decoded && !isChanged;
  } catch (err) {
    return false;
  }
};

// Register
module.exports.register = async (req, res, next) => {
  // Checking if the user is logged in
  let exists = await userExists(req);
  // Redirecting to the home page if the user is logged in
  if (exists) return res.redirect("/me");

  // Rendering the register page
  res.status(200).render("register");
};

// Login
module.exports.login = async (req, res, next) => {
  // Checking if the user is logged in
  let exists = await userExists(req);
  // Redirecting to the home page if the user is logged in
  if (exists) return res.redirect("/me");

  // Rendering the login page
  res.status(200).render("login");
};

// Change Password
module.exports.getchangePassword = async (id, req, res, next) => {
  res.status(200).render("changePassword");
};

// Forgot Password
module.exports.forgotPassword = async (req, res, next) => {
  res.status(200).render("forgotPassword");
};

// Get Me
module.exports.getMe = async (id, req, res, next) => {
  let user = await userModel.findById(id);
  res.status(200).render("profile", {
    name: user.name,
    email: user.email,
  });
};

// Get Update
module.exports.getuserUpdate = async (id, req, res, next) => {
  res.status(200).render("updateDetails");
};

// Get User Delete
module.exports.getUserDelete = async (id, req, res, next) => {
  res.status(200).render("deleteUser");
};
