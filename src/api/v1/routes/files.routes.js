const express = require("express");
const router = express.Router();

const { getFilesAtPath, getFile } = require("../controllers/files.controlled");

router.route("/").get(getFilesAtPath);
router.route("/:id").get(getFile);
// router.route("/").post(createFolder);
// router.route("/:id").patch(updateFolder);
// router.route("/:id").delete(deleteFolder);

module.exports = router;
