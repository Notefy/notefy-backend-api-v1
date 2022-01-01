const express = require("express");
const router = express.Router();

const {
    getAllNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote,
} = require("../controllers/notes.controller");

// Add Path
// Update Path
// Delete Path

router.route("/").get(getAllNotes);
router.route("/").post(createNote);
router.route("/:id").get(getNote);
router.route("/:id").patch(updateNote);
router.route("/:id").delete(deleteNote);

module.exports = router;
