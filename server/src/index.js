const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");

const port = process.env.PORT || 8080;
const host = process.env.HOST || "0.0.0.0";

app.use(cors());

const api = express.Router();

router.init(api);
app.use("/api", api);


if (!process.env.HOST) {
	app.listen(port, () => {
	  console.log(`Listening on http://localhost:${port}`);
	});
	
	return;
}
app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
