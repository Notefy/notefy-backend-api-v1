const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
    {
        // title:{
        //     type: String,
        //     trim: true,
        //     required: [true, "Please provide data"],
        // },
        data: {
            type: String,
            trim: true,
            // required: [true, "Please provide data"],
        },
        tags: {
            type: [String],
            trim: true,
        },
        path: {
            type: String,
            trim: true,
            default: "root",
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
