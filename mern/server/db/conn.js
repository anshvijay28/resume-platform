
const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("resume_db");
        console.log("Successfully connected to MongoDB."); 
        
        // for creating "rawTextOfAllResumes.json"
        
        // Uncomment code and replace the file if we ever get more resumes

        // _db.collection("resumes").find().project({ _id: 0, rawText: 1 }).toArray().then(resumes => {
        //   const resumeText = resumes.map(resume => resume.rawText);
        //   const fs = require("fs");
        //   const jsonResumeText = JSON.stringify(resumeText);
        //   fs.writeFileSync('rawTextOfAllResumes.json', jsonResumeText);
        //   //console.log(resumeText);
        //   console.log("Created file");
        // }).catch (err => {
        //   console.log(err);
        // });
        
        // this one was for creating a list of all rawText with id and name fields 

        // _db.collection("resumes").find().project({ _id: 1, firstName: "$name.first", lastName: "$name.last", rawText: 1, }).toArray().then(resume => {
        //   const fs = require("fs");
        //   const jsonResumeText = JSON.stringify(resume);
        //   fs.writeFileSync('resumeObjects.json', jsonResumeText);
        //   //console.log(resume);
        //   console.log("Created file");
        // }).catch(err => {
        //   console.log(err);
        // });
  
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};
