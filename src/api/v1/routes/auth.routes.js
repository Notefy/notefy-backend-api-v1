const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication.middleware");
const {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/user", authenticateUser, updateUser);
router.delete("/user", authenticateUser, deleteUser);

module.exports = router;
