// This will help us connect to the database
const dbo = require("../db/conn");
const Realm = require("realm");
const realmApp = new Realm.App({id: process.env.APP_ID});
const bson = require('bson');
const {verifyClientToken} = require("./admin");
var ObjectId = require('mongodb').ObjectID;

exports.addResume = async (req, res) => {
    if (req.body.resume === undefined || req.headers.accesstoken === undefined) {
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
                .collection("resumes")
                .insertOne(req.body.resume)
                .then((result) => {
                    res.json({message: "Successfully added resume", status: "SUCCESS"});
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

exports.addResumeFile = async (req, res) => {
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
            let query = {
                "name.first": req.query.first,
                "name.last": req.query.last
            }
            let db_connect = dbo.getDb();
            db_connect
                .collection("resumes")
                .updateOne(
                    query,
                    {
                        $set: {
                            fileData: bson.Binary(req.body.buffer)
                        }
                    },
                    false,
                    true
                )
                .then((result) => {
                    res.json({message: "Successfully added resume", status: "SUCCESS"});
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

exports.getDoc = async (req, res) => {
    if (req.headers.accesstoken === undefined || req.query.id === undefined) {
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
                .collection("resumes")
                .findOne({_id: new ObjectId(req.query.id)})
                .then((result) => {
                    res.json({message: "Successfully found resume", status: "SUCCESS", doc: result});
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

exports.search = async (req, res) => {
    if (req.body.search === undefined || req.headers.accesstoken === undefined) {
        res.status(400).send("Missing required fields");
        return;
    }
    verifyClientToken(req.headers.accesstoken)
    .then( (result) => {
        if (result.action !== "PASS") {
            res.status(401).send(result.action);
            return;
        } else if (result.action === "PASS") {
            if (req.body.search == null || req.body.search == "") {
                res.status(401).send("Please enter a search term");
                return;
            }
            let db_connect = dbo.getDb();
            db_connect
                .collection("resumes")
                .find({})
                .toArray()
                .then((resumes) => {
                    var hits = [];
                    resumes.forEach((resume) => {
                        let rawText = resume.rawText.toLowerCase()
                        if (rawText.includes(req.body.search.toLowerCase())) {
                            hits.push(resume);
                        }
                    });
                    res.json({message: "Successfully searched", results: hits});
        
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





    
