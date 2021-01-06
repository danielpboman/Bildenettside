const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const avatarSchema = new mongoose.Schema({
  fileName: mongoose.Schema.Types.String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

avatarSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Avatar", avatarSchema);
