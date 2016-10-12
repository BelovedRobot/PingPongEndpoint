var express = require('express');
var router = express.Router();
var config = require('../data/config');
var azure = require('azure-storage');
var multer = require('multer');
var fs = require('fs');
import _ = require("lodash");
var documentDB = require('../data/documentDB');

var uploads = multer({
    dest: './uploads/'
});

// POST ../api/app/upload
router.post('/app/upload', uploads.single('file'), function(req, res) {
    // Set the parameters
    var contentType = req.file.mimetype;
    var fileName = req.file.originalname;
    var path = req.file.path;

    // Validate data
    if (!_.has(req.body, 'targetDocument')) {
        res.status(400).send("file upload failed, something happened.");
        return;
    }

    var targetDoc = JSON.parse(req.body.targetDocument);

    // Create the Azure service
    var blobService = azure.createBlobService(config.blobStorageAccount, config.blobAccessKey)
                        .withFilter(new azure.ExponentialRetryPolicyFilter());

    // Set the blob options
    var blobOptions = {
        contentSettings : {
            contentType : contentType
        }, 
        metadata : {
            "targetId" : targetDoc.targetId,
            "targetDocType" : targetDoc.targetDocType,
            "targetProperty" : targetDoc.targetProperty,
            "origin" : req.headers.host
        }
    }
    
    // Upload the blob
    blobService.createBlockBlobFromLocalFile(config.blobFileContainer, fileName, path, blobOptions, function (error, result) {
        // Delete the local file
        fs.unlink(path);
        
        if (error) {
            res.status(400).send("file upload failed, something happened. (error => " + error + ")");
            return;
        }

        // Get blob url
        var blobUrl = `${config.blobEndpoint}${result.name}`;

        // Update the target doc
        documentDB.getDocument(targetDoc.targetId, function(err, results) { 
            if (results != null && err == null && _.isArray(results)) {
                // Update the object
                var target = results[0];

                // Map to custom logic for instances where we are updating an embedded document or an "object" property 
                // or if the root object is an array
                // if (targetDoc.targetProperty == "craneService") {
                //     target = updateCraneServiceOnTicket(target, targetDoc, blobUrl);
                // } else {
                //     target[targetDoc.targetProperty] = blobUrl;
                // }

                // Check for sub-property
                if (targetDoc.subTargetProperty != "") {
                    target[targetDoc.targetProperty][targetDoc.subTargetProperty] = blobUrl;
                } else {
                    target[targetDoc.targetProperty] = blobUrl;
                }
                
                // Update the document
                documentDB.updateDocument(target, function(err, updated) {
                    if (updated != null && updated.id != null && err == null) {
                        var data = { "data" : updated };
                        res.status(200).json(data);
                    } else {
                        // Delete the blob since update failed
                        var blobName = blobUrl.substr(blobUrl.lastIndexOf('/') + 1);
                        blobService.deleteBlobIfExists(config.blobFileContainer, blobName, function (error, result) {
                            console.log("Deleted");
                        });
                        console.log(err);
                        res.status(400).send("document update failed, something happened. (ERROR: " + err.body + ")");
                    }
                });
            } else {
                res.status(400).send("document retrieval failed, something happened. (ERROR: " + err + ")");
            }
        })
    });
});

// DELETE ../api/app/upload
router.delete('/app/upload', function(req, res) {
    if (!_.has(req.body, 'fileName')) {
        res.status(400).send("delete file failed. there was no name specified.")
        return;
    }

    // Set the parameters
    var fileName = req.body.fileName;

    // Create the Azure service
    var blobService = azure.createBlobService(config.blobStorageAccount, config.blobAccessKey)
                        .withFilter(new azure.ExponentialRetryPolicyFilter());

    // Delete the blob
    blobService.deleteBlobIfExists(config.blobFileContainer, fileName, function (error, result) {
        if (error) {
            res.status(400).send("delete file failed, something happened. (error => " + error + ")");
            return;
        }
        res.json({});
    });
});

module.exports = router;