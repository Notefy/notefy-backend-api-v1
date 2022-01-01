const materialColorPalletNames = require("./materialColorPalletNames");
const connectToDB = require("./connectToDB");
const routeErrorHandler = require("./routeErrorHandler.middleware");
const routeNotFound = require("./routeNotFound.middleware");

module.exports = {
    materialColorPalletNames,
    connectToDB,
    routeErrorHandler,
    routeNotFound,
};
