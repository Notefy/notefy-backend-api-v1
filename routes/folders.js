const express = require("express");
const router = express.Router();

const {
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
} = require("../controllers/folders");

router.route("/").get(getFolder);
router.route("/").post(createFolder);
router.route("/").patch(updateFolder);
router.route("/").delete(deleteFolder);

module.exports = router;
