const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
const User = require("../models/userSchema");
const constants = require("../utils/constants");
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "NO token provided ! Access prohibited",
    });
  }
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "UnAuthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ userId: req.userId });
  if (user && user.userType == constants.userTypes.admin) {
    next();
  } else {
    res.status(400).send({
      message: "Only Admin users are able to access these end point",
    });
  }
};
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};

module.exports = authJwt;
