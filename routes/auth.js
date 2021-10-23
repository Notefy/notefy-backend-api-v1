const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");
const { register, login, updateUser } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);

// Add Tags
// Update Tags
// Delete Tags

// Add Path
// Update Path
// Delete Path
router.patch("/user", authenticateUser, updateUser);

module.exports = router;
