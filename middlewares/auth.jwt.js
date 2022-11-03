const { request } = require("express");
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

const isValidUserIdInRequestParam = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    // console.log(req.params.id);
    if (!user) {
      return res.status(400).send({
        message: "UserId passed doesn't exist",
      });
    }
    next();
  } catch (err) {
    console.log("Error while reading the user info", err.message);
    return res.status(500).send({
      message: "Some Internal server error",
    });
  }
};
const isAdminOrOwner = (req, res, next) => {
  try {
    if (req.user.userType == constants.userType.admin) {
      req.user.isAdmin = true; // adds isAdmin tag for further use in controller
      next();
    } else if (req.user.userId == req.params.id) {
      next();
    } else {
      return res.status(403).send({
        message: "Only admin or owner is allowed to make this call",
      });
    }
  } catch (err) {
    console.log("#### Error while reading the user info #### ", err.message);
    return res.status(500).send({
      message: "Internal server error while reading the user data",
    });
  }
};
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrOwner: isAdminOrOwner,
  isValidUserIdInRequestParam: isValidUserIdInRequestParam,
};

module.exports = authJwt;
