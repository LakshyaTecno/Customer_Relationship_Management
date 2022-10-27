const authcontroller = require("../controllers/auth.controller");

const { verifySignUp } = require("../middlewares");
module.exports = (app) => {
  app.post(
    "/crm/api/v1/auth/signup",
    [verifySignUp.validateSignUpRequestBody],
    authcontroller.signup
  );

  app.post(
    "/crm/api/v1/auth/signin",
    [verifySignUp.validateSignInRequestBody],
    authcontroller.signin
  );
};
