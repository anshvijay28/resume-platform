const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '../', 'config.env') });
const pineconeFunctions = require("../Pinecone/upsertAndQuery");

// This will help us connect to the database
const dbo = require("../db/conn");
const Realm = require("realm");
const realmApp = new Realm.App({id: process.env.APP_ID});
const bson = require('bson');
const {verifyClientToken} = require("./admin");
var ObjectId = require('mongodb').ObjectID;


exports.pineconeQuery = async (req, res) => {
    const userEntry = req.body.search;

    if (userEntry === undefined) {
        res.status(400).send("Your search entry was null.");
        return;
    }
    if (req.headers.accesstoken === undefined) {
        res.status(400).send("Access Token is undefined.");
        return;
    }
    verifyClientToken(req.headers.accesstoken)
    .then((result) => {
        if (result.action !== "PASS") {
            res.status(401).send(result.action);
            return;
        } else if (result.action === "PASS") {
            if (userEntry == null) {
                res.status(401).send("Please enter a search term");
                return;
            }
            pineconeFunctions.query(userEntry).then(response => {
                let relevantBrothers = response;
                let db_connect = dbo.getDb();
                db_connect
                    .collection("resumes")
                    .find({})
                    .toArray()
                    .then((resumes) => {
                        let hits = [];
                        resumes.forEach((resume) => {
                            let firstName = resume.name.first.toLowerCase();
                            let lastName = resume.name.last.toLowerCase();
                            
                            relevantBrothers.forEach((brother) => {
                                let relevantFirst = brother.split(" ")[0].toLowerCase(); 
                                let relevantLast = brother.split(" ")[1].toLowerCase();
                                if (firstName == relevantFirst && lastName == relevantLast) {
                                    hits.push(resume);
                                }
                            })
                        });
            
                        hits.sort((a, b) => {
                            const fullNameA = `${a.name.first} ${a.name.last}`;
                            const fullNameB = `${b.name.first} ${b.name.last}`;
                          
                            const indexA = relevantBrothers.indexOf(fullNameA);
                            const indexB = relevantBrothers.indexOf(fullNameB);

                            return indexA - indexB;
                        })

                        res.json({message: "Successfully searched", results: hits});
                    })
            })
            .catch(err => console.log(err)) 
        }
    })
    .catch((err) => {
        res.json(err);
    });    
}