const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const Folder = require("../models/folders.model");

// TODO: Root path has to be "" or undefined
const getFolderList = async (req, res) => {
    const folderID = req.params.id;
    const folder = await Folder.findOne({
        _id: folderID,
        createdBy: req.userID,
    });

    if (!folder)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder not Found" });

    folder.path.push(folder.name);
    const folderlist = await Folder.find({
        path: folder.path,
        createdBy: req.userID,
    });

    return res
        .status(StatusCodes.OK)
        .json({ folderlist, count: folderlist.length });
};

// Takes a folderPath, folderName and user and returns true or false if folder with path exists
const doesFolderWithPathAndNameExists = async ({
    folderPath,
    folderName,
    createdBy,
}) => {
    const folderlist = await Folder.find({
        path: folderPath,
        createdBy,
    }).select("name path -_id");
    return Object.values(folderlist.map((_) => _.name)).includes(folderName);
};

const createFolder = async (req, res) => {
    const folderName = req.body.name;
    const folderColor = req.body.color;
    const folderTags = req.body.tags;
    const folderPathString = req.body.path || "";
    const folderPath = folderPathString.split("/");

    // Folder path exists
    const validFolderPath = await doesFolderWithPathAndNameExists({
        folderPath: folderPath.slice(0, folderPath.length - 1),
        folderName: folderPath[[folderPath.length - 1]],
        createdBy: req.userID,
    });
    if (!(folderPath.length === 1 || validFolderPath))
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder Doesnt Exists" });

    // Duplicate folder check
    const duplicateFolder = await doesFolderWithPathAndNameExists({
        folderPath,
        folderName,
        createdBy: req.userID,
    });
    if (duplicateFolder)
        return res
            .status(StatusCodes.OK)
            .json({ msg: "Folder Already Exists" });

    // // Insert
    const folder = await Folder.create({
        name: folderName,
        path: folderPath,
        tags: folderTags,
        color: folderColor,
        createdBy: req.userID,
    });
    return res.status(StatusCodes.OK).json({ folder });
};

const updateFolder = async (req, res) => {
    const userID = req.userID;
    const folderID = req.params.id;
    const updateType = req.body.type;
    const newFolderName = req.body.name;
    const newFolderColor = req.body.color;
    const newFolderTags = req.body.tags;

    const folder = await Folder.findOne({
        _id: folderID,
        createdBy: userID,
    });

    if (!folder)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder not Found" });

    if (updateType === "color") {
        const newFolderData = await Folder.findOneAndUpdate(
            { _id: folderID, createdBy: userID },
            { $set: { color: newFolderColor } },
            { new: true, runValidators: true }
        );
        return res
            .status(StatusCodes.OK)
            .json({ msg: "Updated", newFolderData });
    } else if (updateType === "tags") {
        const newFolderData = await Folder.findOneAndUpdate(
            { _id: folderID, createdBy: userID },
            { $set: { tags: newFolderTags } },
            { new: true, runValidators: true }
        );
        return res
            .status(StatusCodes.OK)
            .json({ msg: "Updated", newFolderData });
    } else if (updateType === "name") {
        // Update Child Folders
        let subfolder = 0;
        let matchObj = {};
        matchObj[`path.${folder.path.length}`] = newFolderName;

        await Folder.aggregate()
            .project({
                slicedPath: { $slice: ["$path", folder.path.length + 1] },
                path: 1,
            })
            .match({
                slicedPath: [...folder.path, folder.name],
                createdBy: req.user.userID,
            })
            .cursor({ batchSize: 1000 })
            .eachAsync(async (doc, i) => {
                subfolder = i;
                await Folder.findByIdAndUpdate(
                    doc._id,
                    { $set: matchObj },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            });

        // Update Current Folder
        const newFolder = await Folder.findByIdAndUpdate(
            folderID,
            { $set: { name: newFolderName } },
            { new: true, runValidators: true }
        );

        return res
            .status(StatusCodes.OK)
            .json({ msg: "Updated", newFolder, subfolder: subfolder + 1 });
    }

    res.status(StatusCodes.OK).json({ msg: "Dev" });
};

const deleteFolder = async (req, res) => {
    const folderID = req.params.id;
    const folder = await Folder.findOne({
        _id: folderID,
        createdBy: req.userID,
    });

    if (!folder)
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "Folder not Found" });

    // Delete Child Folders
    let subfolder = 0;
    await Folder.aggregate()
        .project({
            slicedPath: { $slice: ["$path", folder.path.length] },
        })
        .match({ slicedPath: folder.path, createdBy: req.userID })
        .cursor({ batchSize: 2 })
        .eachAsync(async (doc, i) => {
            subfolder = i;
            await Folder.findByIdAndDelete(doc._id);
        });

    // Delete Current Folder
    await Folder.findByIdAndDelete(folderID);

    return res
        .status(StatusCodes.OK)
        .json({ msg: "Deleted", subfolder: subfolder + 1 });
};

module.exports = { getFolderList, createFolder, updateFolder, deleteFolder };
