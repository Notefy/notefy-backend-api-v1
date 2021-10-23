require("dotenv").config();
require("express-async-errors");

// const helmet = require('helmet');
// const cors = require('cors');
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const notesRouter = require("./routes/notes");

const authenticateUser = require("./middleware/authentication");
// const notFound = require("./middleware/notFound");
// const errorHandler = require("./middleware/errorHandler");

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

// JSON Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", authenticateUser, notesRouter);

app.use("/", (req, res) => {
    res.send(`<h1>Noto API</h1>`);
});

// Middleware
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI + process.env.MONGO_DB_NAME);
        // await connectDB(
        //     `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=${process.env.MONGO_AUTH_SOURCE}`
        // );
        app.listen(PORT, console.log(`Server is listening to port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
};

start();
