// This will help us connect to the database
const dbo = require("../db/conn");
const Realm = require("realm");
const realmApp = new Realm.App({id: process.env.APP_ID});
const bson = require('bson');
const {verifyClientToken} = require("./admin");
var ObjectId = require('mongodb').ObjectID;

exports.getConstants = async (req, res) => {
    if (req.headers.accesstoken === undefined) {
        console.log("bruh u boutta fail");
        res.status(400).send("Missing required fields");
        return;
    }
    verifyClientToken(req.headers.accesstoken)
    .then( (result) => {
        if (result.action !== "PASS") {
            res.status(401).send(result.action);
            return;
        } else if (result.action === "PASS") {
            let db_connect = dbo.getDb();
            db_connect
                .collection("app-data")
                .findOne({name: "constants"})
                .then((result) => {
                    res.json({message: "Successfully added resume", status: "SUCCESS", constants: result});
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    })
    .catch( (err) => {
        res.json(err);
    });
}