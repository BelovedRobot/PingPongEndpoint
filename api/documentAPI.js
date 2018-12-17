"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lodash_1 = __importDefault(require("lodash"));
const cache = __importStar(require("../data/node_cache"));
var router = express_1.default.Router();
// GET ../api/document/:documentId
router.get('/document/:documentId', function (req, res, next) {
    if (!lodash_1.default.has(req.params, 'documentId')) {
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
router.post('/document', function (req, res) {
    // Validate the model
    let validModel = true;
    console.log(req.body);
    // The docType & id fields are required
    if (!lodash_1.default.has(req.body, 'docType') || lodash_1.default.isNull(req.body.docType) || !lodash_1.default.has(req.body, 'id') || lodash_1.default.isNull(req.body.id))
        validModel = false;
    if (!validModel) {
        return res.status(400).send("Document can not be created. Properties docType & id are required.");
    }
    // Check if the document already exists
    let value = cache.getObject(req.body.id);
    if (value === undefined) {
        return res.status(404).send("Document already exists");
    }
    // Save the document
    let result = cache.storeObject(req.body);
    if (result) {
        return res.status(200).send("Success");
    }
    else {
        return res.status(500).send("Oh shit");
    }
});
// PUT ../api/document
router.put('/document', function (req, res) {
    if (!lodash_1.default.has(req.params, 'documentId')) {
        return res.status(400).send("Document Id is required");
    }
    var documentId = req.params.documentId;
    // Validate the model
    let validModel = true;
    // The docType & id fields are required
    if (!lodash_1.default.has(req.body, 'docType') || lodash_1.default.isNull(req.body.docType) || !lodash_1.default.has(req.body, 'id') || lodash_1.default.isNull(req.body.id))
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
    }
    else {
        return res.status(500).send("Oh shit");
    }
});
// DELETE ../api/document/documentId
router.delete('/document/:documentId', function (req, res) {
    if (!lodash_1.default.has(req.params, 'documentId')) {
        return res.status(400).send("Document Id is required");
    }
    var documentId = req.params.documentId;
    // Perform the delete
    let result = cache.deleteObject(documentId);
    if (result) {
        return res.status(200).send("Success");
    }
    else {
        return res.status(500).send("Oh shit");
    }
});
// GET ../api/document/all
router.get('/document/all', function (req, res) {
    let result = cache.getAllObjects();
    return res.status(200).json(result);
});
exports.default = router;
//# sourceMappingURL=documentAPI.js.map