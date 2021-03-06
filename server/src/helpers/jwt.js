const exjwt = require("express-jwt");

const secret = process.env.JWT_SECRET || "A8d7Dq85A9Qpt7RnsdhwkLVjLfWKfNFx";
const jwtMW = exjwt({
  secret: secret,
  algorithms: ["HS256"],
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] == "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.cookies) {
      return req.cookies.identity;
    }
  },
});

exports.jwtMW = jwtMW;
exports.secret = secret;
