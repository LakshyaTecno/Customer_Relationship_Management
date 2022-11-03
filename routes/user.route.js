const userController = require("../controllers/user.conttroller");
const { authJwt } = require("../middlewares");
module.exports = (app) => {
  app.get(
    "/crm/api/v1/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.findAll
  );
  app.get(
    "/crm/api/v1/users/:id",
    [
      authJwt.verifyToken,
      authJwt.isValidUserIdInRequestParam,
      authJwt.isAdminOrOwner,
    ],
    userController.findUserById
  );

  app.put(
    "/crm/api/v1/users/:id",
    [
      authJwt.verifyToken,
      authJwt.isValidUserIdInRequestParam,
      authJwt.isAdminOrOwner,
    ],
    userController.update
  );
};
