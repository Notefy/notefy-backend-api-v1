const express = require("express");
const router = express.Router();

const {
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
} = require("./folder.controller");

router.route("/:id").get(getFolder);
router.route("/").post(createFolder);
router.route("/:id").patch(updateFolder);
router.route("/:id").delete(deleteFolder);

module.exports = router;
