const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const secretConfig = require("../configs/auth.config");
const constants = require("../utils/constants");

exports.signup = async (req, res) => {
  if (req.body.userType != constants.userTypes.customer) {
    req.body.userStatus = constants.userStatus.pending;
  }

  const userObj = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    userType: req.body.userType,
    password: bcrypt.hashSync(req.body.password),
    userStatus: req.body.userStatus,
  };
  try {
    const userCreated = await User.create(userObj);

    const response = {
      name: userCreated.name,
      userId: userCreated.userId,
      email: userCreated.email,
      userType: userCreated.userType,
      userStatus: userCreated.userStatus,
      createdAt: userCreated.createdAt,
      updatedAt: userCreated.updatedAt,
    };

    res.status(201).send(response);
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
      return res.status(400).send({
        message: "Failed! UserId passed is not correct Please pass valid ID",
      });
    }
    if (user.userStatus == constants.userStatus.pending) {
      return res.status(400).send({
        message: "Not Yet Approved by the ADMIN",
      });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.userId,
      },
      secretConfig.secret,
      {
        expiresIn: 600,
      }
    );

    res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
      accessToken: token,
    });
  } catch (err) {
    console.log("Some Err happend", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};
