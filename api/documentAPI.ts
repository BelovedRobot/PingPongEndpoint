import express from 'express';
import _ from 'lodash';
import * as cache from '../data/node_cache';

var router = express.Router();

// GET ../api/document/:documentId
router.get('/document/:documentId', function(req, res, next) {
    if (!_.has(req.params, 'documentId')) {
        return res.status(400).send("Document Id is required");
    }

    var documentId = req.params.documentId;

    // Check for all route, if so we skip
    if (documentId == "all") {
        return next();
    }
    
    let value = cache.getObject(documentId);

    if (value === undefined) {
        return res.status(404).send("Document not found");
    }

    return res.status(200).json(value);
});

// POST ../api/document
router.post('/document', function(req, res) {
    // Validate the model
    let validModel = true;
    
    // The docType & id fields are required
    if (!_.has(req.body, 'docType') || _.isNull(req.body.docType) || !_.has(req.body, 'id') || _.isNull(req.body.id))
        validModel = false;
    
    if (!validModel) {
        return res.status(400).send("Document can not be created. Properties docType & id are required.");
    }

    // Check if the document already exists
    let value = cache.getObject(req.body.id)
    if (value === undefined) {
        return res.status(404).send("Document already exists");
    }

    // Save the document
    let result = cache.storeObject(req.body);

    if (result) {
        return res.status(200).send("Success");
    } else {
        return res.status(500).send("Oh shit");
    }
});

// PUT ../api/document
router.put('/document', function(req, res) {
    if (!_.has(req.params, 'documentId')) {
        return res.status(400).send("Document Id is required");
    }

    var documentId = req.params.documentId;

    // Validate the model
    let validModel = true;

    // The docType & id fields are required
    if (!_.has(req.body, 'docType') || _.isNull(req.body.docType) || !_.has(req.body, 'id') || _.isNull(req.body.id))
        validModel = false;
        
    if (!validModel) 
        return res.status(400).send("Document can not be created. Properties docType & id are required.");

    // First ensure the document exists
    let existingObject = cache.getObject(documentId);

    if (existingObject === undefined) {
        return res.status(404).send("Document not found");
    }
    
    // Save the document
    let result = cache.storeObject(req.body);

    if (result) {
        return res.status(200).send("Success");
    } else {
        return res.status(500).send("Oh shit");
    }
});

// DELETE ../api/document/documentId
router.delete('/document/:documentId', function(req, res) {
    if (!_.has(req.params, 'documentId')) {
        return res.status(400).send("Document Id is required");
    }

    var documentId = req.params.documentId;
    
    // Perform the delete
    let result = cache.deleteObject(documentId);
    
    if (result) {
        return res.status(200).send("Success");
    } else {
        return res.status(500).send("Oh shit");
    }
});

// GET ../api/document/all
router.get('/document/all', function(req, res) {
    let result = cache.getAllObjects();

    return res.status(200).json(result);
});

export default router;