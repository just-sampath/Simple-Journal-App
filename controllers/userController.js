// Required Imports
const userModel = require("../models/userModel");

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
    const user = await userModel.findByIdAndDelete(id);
    res.status(200).json({
      status: "Success",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};
