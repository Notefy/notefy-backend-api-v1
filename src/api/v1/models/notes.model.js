const mongoose = require("mongoose");

const materialColorsNames = require("../utils/materialsColorsNames");

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide title"],
        },
        data: {
            type: String,
            trim: true,
        },
        tags: {
            type: [String],
            trim: true,
        },
        path: {
            type: [String],
            trim: true,
            default: "/",
        },
        color: {
            type: String,
            default: "grey",
            enum: {
                values: materialColorsNames,
                message: "Color is not supported",
            },
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
