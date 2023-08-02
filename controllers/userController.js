// Required Imports
const userModel = require("../models/userModel");
const entryModel = require("../models/entryModel");
const bcrypt = require("bcrypt");

// User Update
module.exports.userUpdate = async (id, req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await userModel.findByIdAndUpdate(id, {
      name: name,
      email: email,
    });
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
    let deletedEntires = await entryModel.deleteMany({ parent: id });
    let deleted = await userModel.findByIdAndDelete(id);
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
    const user = await userModel.findById(id);
    let { password, newPassword, confirmPassword } = req.body;
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Password" });
    if (newPassword !== confirmPassword)
      return next(new Error("Invalid Password"));
    password = newPassword;
    confirmPassword = newPassword;
    await user.save();
    res.status(200).json({
      status: "Success",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.register = async (req, res, next) => {
  res.status(200).render("register");
};
module.exports.login = async (req, res, next) => {
  res.status(200).render("login");
};
module.exports.getchangePassword = async (id, req, res, next) => {
  res.status(200).render("changePassword");
};
module.exports.forgotPassword = async (req, res, next) => {
  res.status(200).render("forgotPassword");
};
module.exports.getMe = async (id, req, res, next) => {
  let user = await userModel.findById(id);
  res.status(200).render("profile", {
    name: user.name,
    email: user.email,
  });
};

module.exports.getuserUpdate = async (id, req, res, next) => {
  res.status(200).render("updateDetails");
};
