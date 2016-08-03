var express = require('express');
var documentClient = require('documentdb').DocumentClient;
var config = require('../data/config');

// Function getClient
export function getClient() {
    var client = new documentClient(config.endpoint, {'masterKey': config.authKey});
    return client;
}

// Function getCollectionUri
export function getCollectionUri() {
    var collectionUri = 'dbs/' + config.dbDefinition + '/colls/' + config.collectionDefinition;
    return collectionUri;
}

// Function getDocument
export function getDocument(documentId, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{ name: '@id', value: documentId }]
    };
    
    var client = getClient();
    var uri = getCollectionUri();
    
    client.queryDocuments(uri, querySpec).toArray(function(err, results) {
        if(err) return callback(err);

        if(results.length === 1) {
            callback(null, results);
        } else {
            callback(null, null);
        }
    });
}

// Function createDocument
export function createDocument(document, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{ name: '@id', value: document.id }]
    };
    
    var client = getClient();
    var uri = getCollectionUri();

    client.queryDocuments(uri, querySpec).toArray(function(err, results) {
        if(err) return callback(err);
        if(results.length === 0) {
            client.createDocument(uri, document, function(err, created) {
                if(err) return callback(err);
                callback(null, created);
            });
        } else {
            callback(null, results[0]);
        }
    });
}

// Function updateDocument
export function updateDocument(document, callback) {
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{ name: '@id', value: document.id }]
    };

    var client = getClient();
    var uri = getCollectionUri();
    
    client.queryDocuments(uri, querySpec).toArray(function(err, results) {
        if(err) return callback(err);    
        if(results.length === 0) {
            // If document was not returned then return an error
            callback({ code : 400, body : "Existing document not found." });
        } else {
            let documentUrl = `${uri}/docs/${document.id}`;
            client.replaceDocument(documentUrl, document, function (err, updated) {
                if (err) return callback(err);
                callback(null, updated);
            });
        }
    });
}

// Function deleteDocument
export function deleteDocument(documentId, callback) {
    var client = getClient();
    var uri = getCollectionUri();

    // Create the URL
    var docLink = `${uri}/docs/${documentId}`;
    
    client.deleteDocument(docLink, function(err, results) {
        if(err) return callback(err);
        return callback(null, null);
    });
}