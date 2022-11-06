// This will help us connect to the database
const dbo = require("../db/conn");
const Realm = require("realm");
const realmApp = new Realm.App({id: "resume-platform-miyzy"})

exports.search = (req, res) => {
    if (req.body.searchText == null || req.body.searchText == "") {
        res.json({message: "Please enter a search term", status: "ERROR"});
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
                if (rawText.includes(req.body.searchText.toLowerCase())) {
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
            res.json({message: "Successfully searched", status: "SUCCESS", results: results});

        })
        .catch((err) => {
            res.json(err);
        });
}





    
