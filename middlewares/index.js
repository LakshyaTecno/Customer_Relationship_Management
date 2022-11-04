const verifySignUp = require("./verifySignUp");
const authJwt = require("./auth.jwt");
const verifyTicket = require("./ticket.validator");
module.exports = {
  verifySignUp,
  authJwt,
  verifyTicket,
};
