const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: mongoose.Schema.Types.String,
  password: mongoose.Schema.Types.String,
  admin: mongoose.Schema.Types.Boolean,
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Avatar",
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
