const mongoose = require("mongoose");

mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.init = () => {
  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("successfully connected");
  });
};
