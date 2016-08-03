var express = require('express');
var router = express.Router();
var documentDB = require('../data/documentDB');
var config = require('../data/config');
import _ = require('lodash');
import crypto = require("crypto");

// GET ../api/auth
router.post('/auth', function(req, res) {
    if (!_.has(req.body, 'cipher') || _.isNull(req.body.cipher)) {
        res.status(400).send("authentication failed, something happened.");
        return;
    }

    var key = "53a738e847f63b92";
    var iv = "3ac8fd8cb2a87e56";

    // Decipher the body
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decrypted = decipher.update(req.body.cipher, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // Split the parts
    var splitString = decrypted.split('~')
    var email = splitString[0]
    var sentPassword = splitString[1]

    // Get the user from the DB
    var querySpec = {
        query: "SELECT * FROM c WHERE c.docType = 'user' AND c.email = '" + email + "'",
        parameters: []
    };

    var client = documentDB.getClient();
    var uri = documentDB.getCollectionUri();

    client.queryDocuments(uri, querySpec).toArray(function(err, results) {
        if (err) {
            res.status(400).send("authentication failed, something happened. (ERROR: " + err.body + ")");
            return;
        }
        if (results.length > 0) {

            var email = results[0].email
            var password = results[0].password

            if (sentPassword == password) {
                res.status(200).send({ "userId": results[0].id })
                res.json()
            } else {
                res.status(401).send("Denied!")
            }
        } else {  
            res.status(401).send("Denied!"); 
        }
    });
});

module.exports = router;