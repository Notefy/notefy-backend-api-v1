const mongoose = require("mongoose");

const materialColorsNames = require("../utils/materialsColorsNames");

const FolderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Please provide data"],
        },
        tags: {
            type: [String],
            trim: true,
        },
        path: {
            type: String,
            trim: true,
            default: "/",
        },
        color: {
            type: String,
            default: "amber",
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

module.exports = mongoose.model("Folder", FolderSchema);
