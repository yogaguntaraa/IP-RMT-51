if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const routers = require("./routers");
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(routers)

module.exports = app;