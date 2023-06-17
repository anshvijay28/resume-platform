const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '../', 'config.env') });
const pineconeFunctions = require("../Pinecone/upsertAndQuery");

exports.pineconeQuery = async (req, res) => {
    const userEntry = req.body.search;

    pineconeFunctions.query(userEntry).then(response => {
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(409).json(err);
    })
}