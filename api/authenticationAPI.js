"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var documentDB = require('../data/documentDB');
var config = require('../data/config');
const _ = require("lodash");
const crypto = require("crypto");
var sendGridHelper = require('sendgrid').mail;
var moment = require('moment-timezone');
require("moment-duration-format");
// POST ../api/auth
router.post('/auth', function (req, res) {
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
    var splitString = decrypted.split('~');
    var email = splitString[0];
    var sentPassword = splitString[1];
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
    client.queryDocuments(uri, querySpec).toArray(function (err, results) {
        if (err) {
            res.status(400).json({ error: "authentication failed, something happened." });
            return;
        }
        if (results.length > 0) {
            var email = results[0].email;
            var password = results[0].password;
            if (passwordHash == password) {
                return res.status(200).json(results[0]);
            }
            else {
                return res.status(401).json({ result: 'Denied!' });
            }
        }
        else {
            return res.status(401).json({ result: 'Denied!' });
        }
    });
});
// router.get('/auth/email/test', function(req, res) {
//     var tokenValue = new Buffer(req.query.token, 'base64').toString('utf8');
//     // Split the parts
//     var splitString = tokenValue.split('~')
//     var email = splitString[0]
//     var timestamp = splitString[1]
//     console.log(email);
//     console.log(timestamp);
//     res.status(200).json({
//         email : email,
//         time : timestamp
//     });
// });
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
    // Check if user already exists
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
        // Set hash as password on user
        var user = req.body.user;
        user.password = passwordHash;
        // Save the user
        documentDB.createDocument(user, function (error, result) {
            if (error) {
                return res.status(400).json({ error: "Something happened." });
            }
            // Send the verification email
            /* sendVerificationEmail(user.email, req).then(result => {
                // The user was saved return successful creation code (201)
                return res.status(201).json({ data: user });
            }).catch(error => {
                console.log("There was an error sending to the grid. Error => " + error);
                // The verification email failed, however that's not a total failure. Go ahead and send success code.
                return res.status(201).json({ data: user });
            }); */
        });
    }).catch(error => {
        return res.status(400).json({ error: "Something happened." });
    });
});
// POST ../api/auth/update
router.post('/auth/update', function (req, res) {
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
    var splitString = decrypted.split('~');
    var email = splitString[0];
    var sentPassword = splitString[1];
    var newPassword = splitString[2];
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
    client.queryDocuments(uri, querySpec).toArray(function (err, results) {
        if (err) {
            res.status(400).json({ error: "Failed to retrieve user" });
            return;
        }
        if (results.length > 0) {
            var email = results[0].email;
            var password = results[0].password;
            // Make sure the passwords match
            if (passwordHash == password) {
                // The passwords match so we can update the password
                // Get the new password hash
                var newPasswordHash = "";
                hashString(newPassword, function (resultHash) {
                    newPasswordHash = resultHash;
                });
                if (newPasswordHash === "") {
                    return res.status(400).json({ error: "Password is not compatible" });
                }
                // Update the user, then return 200
                let user = results[0];
                user.password = newPasswordHash;
                documentDB.updateDocument(user, function (updateErr, result) {
                    if (updateErr) {
                        return res.status(400).json({ error: "Could not update the user" });
                    }
                    return res.status(200).json({ message: "Success" });
                });
            }
            else {
                return res.status(401).json({ error: 'Authentication failure' });
            }
        }
        else {
            return res.status(401).json({ error: 'Failed to retrieve user' });
        }
    });
});
// POST ../api/auth/hash
router.post('/auth/hash', function (req, res) {
    if (!_.has(req.body, 'value') || _.isNull(req.body.value)) {
        res.status(400).json({ error: "fail, missing arguments." });
        return;
    }
    hashString(req.body.value, function (resultHash) {
        return res.status(200).json({ value: resultHash });
    });
});
// POST ../api/auth/reset
// router.post('/auth/reset', function (req, res) {
//     if (!_.has(req.body, 'cipher') || _.isNull(req.body.cipher)) {
//         res.status(400).json({ error: "authentication failed, something happened." });
//         return;
//     }
//     var key = config.cryptoKey;
//     var iv = config.cryptoIv;
//     // Decipher the body
//     const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
//     var decryptedEmail = decipher.update(req.body.cipher, 'base64', 'utf8');
//     decryptedEmail += decipher.final('utf8');
//     // Get the user from the DB
//     var querySpec = {
//         query: "SELECT * FROM c WHERE c.docType = 'user' AND c.email = '" + decryptedEmail + "'",
//         parameters: []
//     };
//     var client = documentDB.getClient();
//     var uri = documentDB.getCollectionUri();
//     client.queryDocuments(uri, querySpec).toArray(function (err, results) {
//         if (err) {
//             res.status(400).json({ error: "Failed to retrieve user" });
//             return;
//         }
//         if (results.length > 0) {
//             // Get a new password
//             var uuid = require('node-uuid');
//             var uuid = uuid.v4();
//             var splitString = uuid.split('-');
//             var newPassword = splitString[splitString.length - 1];
//             // Get the new password hash
//             var newPasswordHash = "";
//             hashString(newPassword, function (resultHash) {
//                 newPasswordHash = resultHash;
//             });
//             if (newPasswordHash === "") {
//                 return res.status(400).json({ error: "Password is not compatible" });
//             }
//             // Update the user, then return 200
//             let user = results[0];
//             user.password = newPasswordHash;
//             documentDB.updateDocument(user, function (updateErr, result) {
//                 if (updateErr) {
//                     return res.status(400).json({ error: "Could not update the user" });
//                 }
//                 // Send Email
//                 sendPasswordResetEmail(decryptedEmail, newPassword).then(result => {
//                     return res.status(200).json({ message : "Success" });
//                 }).catch(error => {
//                     return res.status(401).json({ message : "Failed to send confirmation email" });
//                 });
//             });
//         } else {
//             return res.status(401).json({ error: 'Failed to retrieve user' });
//         }
//     });
// });
function hashString(value, callback) {
    var hash = crypto.createHash("sha256");
    hash.on('readable', () => {
        var data = hash.read();
        if (data) {
            callback(data.toString('hex'));
        }
    });
    hash.write(value);
    hash.end();
}
function doesUserExist(emailAddress) {
    var querySpec = {
        query: `SELECT * FROM docs d WHERE d.docType = 'user' AND d.email = '${emailAddress}'`,
        options: []
    };
    return new Promise((resolve, reject) => {
        documentDB.queryDatabase(querySpec).then(result => {
            // If there is a result, then the user exists
            if (result.length > 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }).catch(error => {
            console.log(error);
            reject();
        });
    });
}
// function sendPasswordResetEmail(emailAddress, newPassword): Promise<boolean> {
//     return new Promise<boolean>((resolve, reject) => {
//         // Get the html
//         var htmlResponse = "<%password%>"; // Create blank template just in case
//         fs.readFile('UI/email_passwordReset.html', 'utf8', function (err, data) {
//             if (err) {
//                 reject();
//                 return;
//             }
//             htmlResponse = data;
//             htmlResponse = htmlResponse.replace('<%password%>', newPassword);
//             // Actually Send the Email
//             var from_email = new sendGridHelper.Email('doNotReply@huntlogapp.com');
//             var to_email = new sendGridHelper.Email(emailAddress);
//             var subject = 'HuntLog, Password Reset';
//             var content = new sendGridHelper.Content('text/html', htmlResponse);
//             var mail = new sendGridHelper.Mail(from_email, subject, to_email, content);
//             var sg = require('sendgrid')(config.sendGridKey);
//             var request = sg.emptyRequest({
//                 method: 'POST',
//                 path: '/v3/mail/send',
//                 body: mail.toJSON()
//             });
//             sg.API(request, function (error, response) {
//                 if (error) {
//                     reject();
//                 }
//                 resolve(true);
//             });
//         });
//     });
// }
module.exports = router;
//# sourceMappingURL=authenticationAPI.js.map