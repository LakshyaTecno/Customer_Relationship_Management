const User = require("../models/userSchema");
const Ticket = require("../models/ticketSchema");
const constants = require("../utils/constants");

exports.createTicket = async (req, res) => {
  try {
    const ticketObj = {
      title: req.body.title,
      ticketPriority: req.body.ticketPriority,
      description: req.body.description,
      reporter: req.userId,
    };
    // console.log("I am here");
    // let engineers = await User.find({
    //   userType: constants.userTypes.engineer,
    //   userStatus: constants.userStatus.approved,
    // });
    // console.log(engineers);
    // let engineerHavingMinimumTickets = engineers[0];
    // let curMinLength = engineers[0].ticketsAssigned.length;

    let engineer = await User.findOne({
      userType: constants.userTypes.engineer,
      userStatus: constants.userStatus.approved,
    });

    if (engineer) {
      //   engineers.map((engineer) => {
      //     if (engineer.ticketsAssigned.length < curMinLength) {
      //       curMinLength = engineer.ticketsAssigned.length;
      //       engineerHavingMinimumTickets = engineer;
      //     }
      //   });

      ticketObj.assignee = engineer.userId;
    }

    const ticketCreated = await Ticket.create(ticketObj);
    if (ticketCreated) {
      const customer = await User.findOne({
        userId: req.userId,
      });

      customer.ticketsCreated.push(ticketCreated._id);
      await customer.save();
      if (engineer) {
        engineer.ticketsAssigned.push(ticketCreated._id);
        await engineer.save();
      }

      res.status(201).send(ticketCreated);
    }
  } catch (err) {
    console.log("Error While doing the DB opreations", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};

exports.getAllTickets = async (req, res) => {
  /**
   * We need to find the userType
   * and depending on the user type we need to frame the search query
   */

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

    console.log(queryObj);
  } else if (user.userType == constants.userTypes.engineer) {
    queryObj["$or"] = [
      { _id: { $in: ticketsCreated } },
      { _id: { $in: ticketsAssigned } },
    ];

    console.log(queryObj);
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
