const express = require("express");
const router = express.Router();

const { routeNotFound, routeErrorHandler } = require("../utils");

const { userRoutes, authenticateUser } = require("../users");
router.use("/auth", userRoutes);

const { fileRoutes } = require("../files");
router.use("/file", authenticateUser, fileRoutes);

// const { folderRoutes } = require("../folders");
// router.use("/folder", authenticateUser, folderRoutes);

// const { noteRoutes } = require("../notes");
// router.use("/note", authenticateUser, noteRoutes);

router.use("/", (req, res) => {
    res.send(`<h1>Noto API v2</h1>`);
});

router.use(routeNotFound);
router.use(routeErrorHandler);

module.exports = router;
