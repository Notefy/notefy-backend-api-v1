const mongoose = require("mongoose");

const connectDB = (uri) =>
    mongoose.connect(uri).then(() => console.log(`Connected to DB...`));

module.exports = connectDB;
