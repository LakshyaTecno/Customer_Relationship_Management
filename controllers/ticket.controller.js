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

    let engineers = await User.find({
      userType: constants.userTypes.engineer,
      userStatus: constants.userStatus.approved,
    });
    let engineerHavingMinimumTickets = engineers[0];
    let curMinLength = engineers[0].ticketsAssigned.length;

    if (engineers) {
      engineers.map((engineer) => {
        if (engineer.ticketsAssigned.length < curMinLength) {
          curMinLength = engineer.ticketsAssigned.length;
          engineerHavingMinimumTickets = engineer;
        }
      });

      ticketObj.assignee = engineerHavingMinimumTickets;
      const ticketCreated = await Ticket.create(ticketObj);
      if (ticketCreated) {
        const customer = User.findOne({
          userId: req.userId,
        });

        customer.ticketsCreated.push(ticketCreated._id);
        await customer.save();
        engineerHavingMinimumTickets.ticketsAssigned.push(ticketCreated._id);
        await engineerHavingMinimumTickets.save();

        res.status(201).send(ticketCreated);
      }
    } else {
      res
        .status(401)
        .send({
          msg: "Currently we don't have any Engineer who is approved by Admin",
        });
    }
  } catch (err) {
    console.log("Error While doing the DB opreations", err.message);
    res.status(500).send({
      message: "Some Internal server error",
    });
  }
};
