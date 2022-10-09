const express = require("express");

// routes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const routes = express.Router();

const {doTest} = require('./test');



// This section will help you get a list of all the records.
routes.route("/test").get(doTest);


module.exports = routes;
