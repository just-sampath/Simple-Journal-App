// Required Imports
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true, "Please provide a username"],
  },
  email: {
    type: "String",
    requred: [true, "Please provide an email"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: "String",
    requred: [true, "Please provide a password"],
    minlength: 8,
    validate: [validator.isStrongPassword, "Please provide a strong password"],
    select: false,
  },
  confirmPassword: {
    type: "String",
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match!",
    },
    select: false,
  },
  passwordChangedAt: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
});

// Hashing the password
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 12).then((hash) => {
    this.password = hash;
    this.confirmPassword = undefined;
    next();
  });
});

// Comparing the password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generating the token
/*userSchema.methods.generateToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
}*/

// changed password after
userSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// Creating the User Model
const Users = mongoose.model("Users", userSchema);

// Exporting the User Model
module.exports = Users;
