const jwt = require("jsonwebtoken");
require("dotenv").config();

function tokenVerification(req, res, next) {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodeduser) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token!" });
    }
    req.user = decodeduser;
    next();
  });
}
module.exports = tokenVerification;



