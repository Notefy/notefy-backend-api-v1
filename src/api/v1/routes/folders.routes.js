const express = require("express");
const router = express.Router();

const {
    getFolderList,
    createFolder,
    updateFolder,
    deleteFolder,
} = require("../controllers/folders.controller");

router.route("/:id").get(getFolderList);
router.route("/").post(createFolder);
router.route("/:id").patch(updateFolder);
router.route("/:id").delete(deleteFolder);

module.exports = router;
