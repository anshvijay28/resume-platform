// This will help us connect to the database
const dbo = require("../db/conn");
const Realm = require("realm");
const realmApp = new Realm.App({id: process.env.APP_ID});
const {verifyClientToken} = require("./admin");

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
                        let rawText = resume.resumes[0].data.rawText.toLowerCase()
                        if (rawText.includes(req.body.search.toLowerCase())) {
                            hits.push(resume.resumes[0].data);
                        }
                    });
        
                    let results = [];
                    hits.forEach((hit) => {
                        let result = {
                            name: hit.name.raw,
                            email: hit.emails[0],
                            linkedin: hit.linkedin
                        }
                        results.push(result);
                    });
                    res.json({message: "Successfully searched", results: results});
        
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





    
