const userRoute = require("./user")
const express = require("express");
const routes = express.Router();

routes.use("/user" ,userRoute );

module.exports = routes;


