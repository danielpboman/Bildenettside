const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const imageSchema = new mongoose.Schema({
  fileName: mongoose.Schema.Types.String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  uploaded: mongoose.Schema.Types.Date,
});

imageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Image", imageSchema);
