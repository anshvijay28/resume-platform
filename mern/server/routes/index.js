const express = require("express");

// routes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const routes = express.Router();
const {addUser, logonUser} = require("./auth"); 
const {search, addResume, addResumeFile, getDoc} = require("./search");
const {getConstants} = require("./constants");



// This section will help you get a list of all the records.
routes.route("/signup").post(addUser);
routes.route("/login").post(logonUser);
routes.route("/search").post(search);
routes.route("/resume").post(addResume);
routes.route("/file").post(addResumeFile);
routes.route("/doc").get(getDoc);
routes.route("/constants").get(getConstants);


module.exports = routes;
