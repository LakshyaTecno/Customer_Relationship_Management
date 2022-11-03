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

    return res.status(200).send(objectConverter.userResponse(user));
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    user.userStatus =
      req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;
    user.name = req.body.name != undefined ? req.body.name : user.name;
    user.userType =
      req.body.userType != undefined ? req.body.userType : user.userType;
    const updatedUser = await user.save();
    res.status(200).send({
      name: updatedUser.name,
      userId: updatedUser.userId,
      email: updatedUser.email,
      userType: updatedUser.userType,
      userStatus: updatedUser.userStatus,
    });
  } catch (err) {
    console.log("Error whileDB operation", err.message);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
