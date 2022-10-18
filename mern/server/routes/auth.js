// This will help us connect to the database
const dbo = require("../db/conn");
const Realm = require("realm");
const realmApp = new Realm.App({id: "resume-platform-miyzy"})

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

exports.addUser = (req, res) => {
    realmApp.emailPasswordAuth.registerUser({
        email: req.body.email,
        password: req.body.password
    })
    .then(() => {
        const credentials = Realm.Credentials.emailPassword(req.body.email, req.body.password);
        realmApp.logIn(credentials);
        res.json({message: "Successfully created a user and logged in"});
    })
    .catch(err => res.json({message: err.message}));
}

exports.logonUser = (req, res) => {
    const credentials = Realm.Credentials.emailPassword(req.body.email, req.body.password);
    realmApp.logIn(credentials)
    .then(user => res.json({message: "Successfully logged in", status: "SUCCESS", user: user}))
    .catch(err => res.json({message: err.message}));
}




    
