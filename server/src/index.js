const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");

const port = process.env.PORT || 1337;
const host = process.env.HOST || "192.168.0.100";

app.use(cors());

const api = express.Router();

router.init(api);
app.use("/api", api);

app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
