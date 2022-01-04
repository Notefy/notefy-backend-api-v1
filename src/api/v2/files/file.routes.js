const express = require("express");
const router = express.Router();

const {
    getFilesAtRoot,
    getFile,
    createFile,
    updateFile,
    deleteFile,
} = require("./file.controller");

router.route("/").post(createFile);
router.route("/").get(getFilesAtRoot);
router.route("/:id").get(getFile);
router.route("/:id").patch(updateFile);
router.route("/:id").delete(deleteFile);

module.exports = router;
