// This will help us connect to the database
const Realm = require("realm");
const realmApp = new Realm.App({id: process.env.APP_ID});
const dbo = require("../db/conn");


exports.addUser = (req, res) => {
    if (!req.body.password || !req.body.email) {
        res.status(400).send("Please enter a valid email and password");
        return;
    }
    realmApp.emailPasswordAuth.registerUser({
        email: req.body.email,
        password: req.body.password
    })
    .then(() => {
        const credentials = Realm.Credentials.emailPassword(req.body.email, req.body.password);
        return realmApp.logIn(credentials)
    })
    .then(user => {
        let db_connect = dbo.getDb("resume_db");
        let myUser = {
            uid: user.id,
            email: user.profile.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            GTID: req.body.GTID,
            name: req.body.name
        };
        let dataUser = {
            uid: user.id,
            email: user.profile.email,
            GTID: req.body.GTID,
            name: req.body.name
        }

        db_connect
                .collection("users")
                .insertOne(dataUser)
                .catch((err) => {
                    res.json(err);
                });
        res.json({message: "Successfully logged in", status: "SUCCESS", user: myUser})
    })
    .catch(err => res.json({message: err.message}));
}

exports.logonUser = (req, res) => {
    if (!req.body.password || !req.body.email) {
        res.status(400).send("Please enter a valid email and password");
        return;
    }
    const credentials = Realm.Credentials.emailPassword(req.body.email, req.body.password);
    realmApp.logIn(credentials)
    .then(user => {
        let db_connect = dbo.getDb("resume_db");
        let myUser = {
            uid: user.id,
            email: user.profile.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
        };

        db_connect
        .collection("users")
        .findOne({uid: user.id})
        .then((data) => {
            myUser.GTID = data.GTID;
            myUser.name = data.name;
            res.json({message: "Successfully logged in", status: "SUCCESS", user: myUser})
        })
        .catch((err) => {
            res.json(err);
        });
        
    })
    .catch(err => res.status(400).json({message: err.message}));
}




    
