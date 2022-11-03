const ticketController = require("../controllers/ticket.controller");
const { authJwt } = require("../middlewares");

module.exports = (app) => {
  app.post(
    "crm/api/tickets",
    [authJwt.verifyToken],
    ticketController.createTicket
  );
};
