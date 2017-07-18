"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var documentClient = require('documentdb').DocumentClient;
var config = require('../data/config');
var documentDB = require('../data/documentDB');
var _ = require("lodash");
// Function getClient
function getClient() {
    var client = new documentClient(config.endpoint, { 'masterKey': config.authKey });
    return client;
}
exports.getClient = getClient;
// Function getCollectionUri
function getCollectionUri() {
    var collectionUri = 'dbs/' + config.dbDefinition + '/colls/' + config.collectionDefinition;
    return collectionUri;
}
exports.getCollectionUri = getCollectionUri;
// Function getDocument
function getDocument(documentId, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{ name: '@id', value: documentId }]
    };
    var client = getClient();
    var uri = getCollectionUri();
    client.queryDocuments(uri, querySpec).toArray(function (err, results) {
        if (err)
            return callback(err);
        if (results.length === 1) {
            callback(null, results);
        }
        else {
            callback(null, null);
        }
    });
}
exports.getDocument = getDocument;
// Function createDocument
function createDocument(document, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{ name: '@id', value: document.id }]
    };
    var client = getClient();
    var uri = getCollectionUri();
    client.queryDocuments(uri, querySpec).toArray(function (err, results) {
        if (err)
            return callback(err);
        if (results.length === 0) {
            client.createDocument(uri, document, function (err, created) {
                if (err)
                    return callback(err);
                callback(null, created);
            });
        }
        else {
            callback(null, results[0]);
        }
    });
}
exports.createDocument = createDocument;
// Function updateDocument
function updateDocument(document, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{ name: '@id', value: document.id }]
    };
    var client = getClient();
    var uri = getCollectionUri();
    client.queryDocuments(uri, querySpec).toArray(function (err, results) {
        if (err)
            return callback(err);
        if (results.length === 0) {
            // If document was not returned then return an error
            callback({ code: 400, body: "Existing document not found." });
        }
        else {
            var documentUrl = uri + "/docs/" + document.id;
            client.replaceDocument(documentUrl, document, function (err, updated) {
                if (err)
                    return callback(err);
                callback(null, updated);
            });
        }
    });
}
exports.updateDocument = updateDocument;
// Function deleteDocument
function deleteDocument(documentId, callback) {
    var client = getClient();
    var uri = getCollectionUri();
    // Create the URL
    var docLink = uri + "/docs/" + documentId;
    client.deleteDocument(docLink, function (err, results) {
        if (err)
            return callback(err);
        return callback(null, null);
    });
}
exports.deleteDocument = deleteDocument;
// Function queryDatabase
function queryDatabase(querySpec) {
    var client = documentDB.getClient();
    var uri = documentDB.getCollectionUri();
    return new Promise(function (resolve, reject) {
        client.queryDocuments(uri, querySpec).toArray(function (err, results) {
            if (err || _.isUndefined(results)) {
                return reject(err);
            }
            if (results.length > 0) {
                resolve(results);
            }
            else {
                resolve([]);
            }
        });
    });
}
exports.queryDatabase = queryDatabase;
// Function queryDatabaseLargeResult
function queryDatabaseLargeResult(querySpec) {
    var client = documentDB.getClient();
    var uri = documentDB.getCollectionUri();
    var feedOptions = {
        maxItemCount: 1000,
        continuation: "69692275-21c1-42bc-8c41-6314ccde98fc"
    };
    return new Promise(function (resolve, reject) {
        client.queryDocuments(uri, querySpec, feedOptions).toArray(function (err, results) {
            if (err || _.isUndefined(results)) {
                return reject(err);
            }
            if (results.length > 0) {
                resolve(results);
            }
            else {
                resolve([]);
            }
        });
    });
    // return new Promise<any>((resolve, reject) => {
    //     var bigResults = [];
    //     var queryIterator = client.queryDocuments(uri, querySpec, feedOptions);
    //     while (queryIterator.hasMoreResults()) {
    //         queryIterator.executeNext(function (err, docs, headers) {
    //             if (err) {
    //                 return reject(err);
    //             }
    //             _.concat(bigResults, docs);
    //         });
    //     }
    //     resolve(bigResults);
    // });
}
exports.queryDatabaseLargeResult = queryDatabaseLargeResult;
//# sourceMappingURL=documentDB.js.map