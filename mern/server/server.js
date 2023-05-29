const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.raw({type: 'application/pdf', limit: '50mb'}));
app.use(bodyParser.json());
require("dotenv").config({ path: path.join(__dirname, 'config.env') });
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors({ origin: "*" }));
app.use(express.json());

// // define routes
// const authRoute = require("./routes/auth");
// const adminRoute = require("./routes/admin");
// const constantsRoute = require("./routes/constants");

// // use routes
// app.use('/auth', authRoute);
// app.use('/admin', adminRoute);
// app.use('/constants', constantsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.use(require("./routes/index"));
const {getAdminKey} = require("./routes/admin");
// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  getAdminKey();
  
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
});

