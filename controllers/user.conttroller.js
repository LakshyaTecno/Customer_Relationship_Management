const { query } = require("express");
const User = require("../models/userSchema");
const objectConverter = require("../utils/objectConverter");
exports.findAll = async (req, res) => {
  const queryObj = {};
  const userTypeQP = req.query.userType;
  const userStatusQp = req.query.userStatus;

  if (userTypeQP) {
    queryObj.userType = userTypeQP;
  }
  if (userStatusQp) {
    queryObj.userStatus = userStatusQp;
  }

  try {
    const users = await User.find(queryObj);
    res.status(200).send(objectConverter.userResponse(users));
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const user = await User.find({ userId: req.params.id });
    console.log(req.param.id);
    console.log("here");
    return res.status(200).send(objectConverter.userResponse(user));
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};
