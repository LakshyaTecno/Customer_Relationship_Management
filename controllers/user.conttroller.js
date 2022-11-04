const Ticket = require("../models/ticketSchema");
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

exports.getAllTickets = async (req, res) => {
  const user = await User.findOne({ userId: req.userId });
  const queryObj = {};
  const ticketsCreated = user.ticketsCreated; // this is an array of ticket _id
  const ticketsAssigned = user.ticketsAssigned;

  if (user.userType == constants.userTypes.customer) {
    if (!ticketsCreated) {
      return res.staus(200).send({
        message: "No tickets created by the user yet",
      });
    }

    queryObj["_id"] = { $in: ticketsCreated };
  } else if (user.userType == constants.userTypes.engineer) {
    queryObj["$or"] = [
      { _id: { $in: ticketsCreated } },
      { _id: { $in: ticketsAssigned } },
    ];
  }

  const tickets = await Ticket.find(queryObj);

  res.status(200).send(tickets);
};

/**
 * Write the controller function to take care of updates
 */
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id });

    /**
     * Update this ticket object based on the request body
     * passed
     */

    ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
    ticket.description =
      req.body.description != undefined
        ? req.body.description
        : ticket.description;
    ticket.ticketPriority =
      req.body.ticketPriority != undefined
        ? req.body.ticketPriority
        : ticket.ticketPriority;
    ticket.status =
      req.body.status != undefined ? req.body.status : ticket.status;
    ticket.assignee =
      req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

    const updatedTicket = await ticket.save();

    res.status(200).send(updatedTicket);
  } catch (err) {
    console.log("Some error while updating ticket ", err.message);
    res.status(500).send({
      message: "Some internal error while updating the ticket",
    });
  }
};
