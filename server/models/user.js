const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  phoneNumber: String,
  password: String,
  country: String,
  bio: String,
  profileImage: String
});

const User = mongoose.model("User", userSchema)

module.exports = User

