const express = require("express");
const router = express.Router();

const { routeNotFound, routeErrorHandler } = require("../utils");

const { userRoutes } = require("../users");
router.use("/auth", userRoutes);

router.use("/", (req, res) => {
    res.send(`<h1>Noto API v2</h1>`);
});

router.use(routeNotFound);
router.use(routeErrorHandler);

module.exports = router;
