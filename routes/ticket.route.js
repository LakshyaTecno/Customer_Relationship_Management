const ticketController = require("../controllers/ticket.controller");
const { authJwt } = require("../middlewares");
const { verifyTicket } = require("../middlewares");

module.exports = (app) => {
  app.post(
    "/crm/api/v1/tickets",
    [authJwt.verifyToken],
    ticketController.createTicket
  );
  app.post(
    "/crm/api/v1/tickets",
    [authJwt.verifyToken],
    ticketController.getAllTickets
  );
  app.put(
    "/crm/api/v1/tickets",
    [authJwt.verifyToken, verifyTicket.isValidOwnerOfTheTicket],
    ticketController.updateTicket
  );
};
