require("dotenv").config();
require("express-async-errors");

// const helmet = require('helmet');
// const cors = require('cors');
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

const express = require("express");
const app = express();

const { connectToDB } = require("./api/v2/utils");

// Extra security packages
// app.set("trust proxy", 1);
// app.use(
//     rateLimiter({
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 100, // limit each IP to 100 requests per windowMs
//     })
// );
app.use(express.json());
// app.use(helmet());
// app.use(cors());
// app.use(xss());

// Routes
app.use("/api/v2/", require("./api/v2/config/").v2Routes);

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectToDB(process.env.MONGO_URI + process.env.MONGO_DB_NAME);
        app.listen(PORT, console.log(`Server is listening to port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
};

start();
