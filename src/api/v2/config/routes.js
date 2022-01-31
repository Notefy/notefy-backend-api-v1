const express = require("express");
const router = express.Router();

const { routeNotFound, routeErrorHandler } = require("../utils");

const { userRoutes, authenticateUser } = require("../users");
router.use("/auth", userRoutes);

const { fileRoutes } = require("../files");
router.use("/file", authenticateUser, fileRoutes);

router.use("/", (req, res) => {
    res.send(`<h1>Noto API v2</h1>`);
});

router.use(routeNotFound);
router.use(routeErrorHandler);

module.exports = router;
