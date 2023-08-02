// Required Imports
const userModel = require("../models/userModel");
const entryModel = require("../models/entryModel");
const bcrypt = require("bcrypt");

// User Update
module.exports.userUpdate = async (id, req, res, next) => {
  try {
    // Getting the name and email from the body
    const { name, email } = req.body;

    // Updating the user
    const user = await userModel.findByIdAndUpdate(id, {
      name: name,
      email: email,
    });

    // Sending the response
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// User Delete
module.exports.userDelete = async (id, req, res, next) => {
  try {
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
    const user = await userModel.findById(id);

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
    res.status(200).json({
      status: "Success",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

// Register
module.exports.register = async (req, res, next) => {
  res.status(200).render("register");
};

// Login
module.exports.login = async (req, res, next) => {
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
