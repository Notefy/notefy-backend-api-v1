const mongoose = require("mongoose");

const connectToDB = (uri) =>
    mongoose.connect(uri).then(() => console.log(`Connected to DB...`));

module.exports = connectToDB;
