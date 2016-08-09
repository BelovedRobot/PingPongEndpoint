var express = require('express');
var router = express.Router();
var documentDB = require('../data/documentDB');
var config = require('../data/config');
import _ = require('lodash');
import crypto = require("crypto");


// GET ../api/auth
router.post('/auth', function(req, res) {
    if (!_.has(req.body, 'cipher') || _.isNull(req.body.cipher)) {
        res.status(400).json({ error: "authentication failed, something happened." });
        return;
    }

    var key = config.cryptoKey;
    var iv = config.cryptoIv;

    // Decipher the body
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decrypted = decipher.update(req.body.cipher, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // Split the parts
    var splitString = decrypted.split('~')
    var email = splitString[0]
    var sentPassword = splitString[1]

    // Get the password hash
    var passwordHash = "";
    hashString(sentPassword, function (resultHash) {
        passwordHash = resultHash;
    });
    if (passwordHash === "") {
        return res.status(400).json({ error: "Something happened." });
    }

    // Get the user from the DB
    var querySpec = {
        query: "SELECT * FROM c WHERE c.docType = 'user' AND c.email = '" + email + "'",
        parameters: []
    };

    var client = documentDB.getClient();
    var uri = documentDB.getCollectionUri();

    client.queryDocuments(uri, querySpec).toArray(function(err, results) {
        if (err) {
            res.status(400).json({ error: "authentication failed, something happened." });
            return;
        }
        if (results.length > 0) {
            var email = results[0].email
            var password = results[0].password

            if (passwordHash == password) {
                return res.status(200).json(results[0])
            } else {
                return res.status(401).json({ result: 'Denied!' });
            }
        } else {
            return res.status(401).json({ result: 'Denied!' });
        }
    });
});



router.get('/auth/email/test', function(req, res) {
    var tokenValue = new Buffer(req.query.token, 'base64').toString('utf8');

    // Split the parts
    var splitString = tokenValue.split('~')
    var email = splitString[0]
    var timestamp = splitString[1]

    console.log(email);
    console.log(timestamp);
    res.status(200).json({
        email : email,
        time : timestamp
    });
});

router.post('/auth/new', function (req, res) {
    if (!_.has(req.body, 'cipher') || _.isNull(req.body.cipher)) {
        res.status(400).json({ error: "request failed, missing parameters." });
        return;
    }

    if (!_.has(req.body, 'user') || _.isNull(req.body.user)) {
        res.status(400).json({ error: "request failed, missing parameters." });
        return;
    }

    if (!_.has(req.body.user, 'docType') || _.isNull(req.body.user.docType)) {
        res.status(400).json({ error: "request failed, missing parameters." });
        return;
    }

    if (!_.has(req.body.user, 'id') || _.isNull(req.body.user.id)) {
        res.status(400).json({ error: "request failed, missing parameters." });
        return;
    }

    // Check if hunter already exists
    doesUserExist(req.body.user.email).then(userExists => {
        if (userExists) {
            return res.status(200).json({ response: "The user already exists" });
        }

        // Decrypt the password
        var key = config.cryptoKey;
        var iv = config.cryptoIv;

        // Decipher the body
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decrypted = decipher.update(req.body.cipher, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        // Now hash the password
        var passwordHash = "";
        hashString(decrypted, function (resultHash) {
            passwordHash = resultHash;
        });
        if (passwordHash === "") {
            return res.status(400).json({ error: "Something happened." });
        }

        // Set hash as password on hunter
        var user = req.body.user;
        user.password = passwordHash;

        // Save the hunter
        documentDB.createDocument(user, function (error, result) {
            if (error) {
                return res.status(400).json({ error: "Something happened." });
            }

            // Send the verification email
            /* sendVerificationEmail(hunter.email, req).then(result => {
                // The hunter was saved return successful creation code (201)
                return res.status(201).json({ data: hunter });
            }).catch(error => {
                console.log("There was an error sending to the grid. Error => " + error);
                // The verification email failed, however that's not a total failure. Go ahead and send success code.
                return res.status(201).json({ data: hunter });
            }); */
        });
    }).catch(error => {
        return res.status(400).json({ error: "Something happened." });
    });
});



function hashString(value, callback) {
    var hash: any = crypto.createHash("sha256");
    hash.on('readable', () => {
        var data = hash.read();
        if (data) {
            callback(data.toString('hex'));
        }
    });

    hash.write(value);
    hash.end();
}

function doesUserExist(emailAddress): Promise<boolean> {
    var querySpec = {
        query: `SELECT * FROM docs d WHERE d.docType = 'user' AND d.email = '${emailAddress}'`,
        options: []
    };

    return new Promise<boolean>((resolve, reject) => {
        documentDB.queryDatabase(querySpec).then(result => {
            // If there is a result, then the user exists
            if (result.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(error => {
            console.log(error);
            reject();
        });
    });
}



module.exports = router;