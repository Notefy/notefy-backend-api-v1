const userRoutes = require("./user.routes");
// const userController = require("./user.controller");
// const userModel = require("./user.model");
const authenticateUser = require("./authentication.middleware");

module.exports = {
    userRoutes,
    // userController,
    // userModel,
    authenticateUser,
};
