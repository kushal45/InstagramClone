require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
require("./database");
const routes = require("./routes");
//const { connectProducer } = require("./kafka/Producer");

const PORT = process.env.PORT || 3000;

app.use(
    cors({ origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_IP] })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);
app.use(routes);
//await connectProducer();
app.listen(PORT);
console.log(`Server running on port ${PORT}`);