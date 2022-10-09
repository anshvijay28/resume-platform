// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

exports.doTest = (req, res) => {
    let db_connect = dbo.getDb("resume_db");
    let data = db_connect
      .collection("test")
      .findOne()
      .then((result) => {
        res.json(result.text);
      });
}