"use strict";
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var authAPI = require('./api/authenticationAPI');
var uploadAPI = require('./api/uploadAPI');
var documentAPI = require('./api/documentAPI');
var receiptAPI = require('./api/receiptAPI');
const _ = require("lodash");
// Server is the backbone, the AppDelegate if you will. All setup here defines our endpoint 
// Endpoint Configuration
// ============================================================================= 
// Set our port
var port = process.env.PORT || 8484;
// Configure bodyParser for getting data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Route Configuration
// =============================================================================
var router = express.Router();
// Configure the /api prefix to all routes
app.use('/api', router);
// Configure a test route to make sure everything is working (accessed at GET http://localhost:8484/api)
router.get('/', function (req, res) {
    res.status(200).send('Hello HuntLog');
});
// Add CORS Support
router.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization,origin');
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // If method is an OPTIONS requested
    if (req.method === "OPTIONS") {
        return res.status(200).send();
    }
    next(); // make sure we go to the next routes and don't stop here
});
var authFreeRoutes = [];
// Optional to add a piece of middleware to use for all requests
router.use(function (req, res, next) {
    // Skip authentication middle-ware for certain routes
    var exceptionIndex = _.findIndex(authFreeRoutes, function (route) {
        return _.startsWith(req.originalUrl, route);
    });
    if (exceptionIndex > -1) {
        next();
        return;
    }
    // Crude authentication, the token must match
    if (_.has(req.headers, 'authorization')) {
        var tokenString = req.headers['authorization'];
        var tokenPrefix = "Token token=";
        var isAuthorized = true;
        // Does the prefix exist
        if (!tokenString.includes(tokenPrefix)) {
            isAuthorized = false;
        }
        // Get Token
        var prefixLength = tokenPrefix.length;
        var token = tokenString.substring(tokenPrefix.length);
        if (!_.isEqual(token, "1726C525-DD97-4DB3-BACE-BB30E9745E46")) {
            isAuthorized = false;
        }
        if (!isAuthorized) {
            console.log("Auth failed");
            return res.status(401).send('Not Authorized');
        }
    }
    else {
        console.log("No header");
        return res.status(401).send('Not Authorized');
    }
    console.log("Auth success");
    next(); // make sure we go to the next routes and don't stop here
});
// Additional Routes
app.use('/api', uploadAPI);
app.use('/api', authAPI);
app.use('/api', documentAPI);
app.use('/api', receiptAPI);
// Start the Server
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
//# sourceMappingURL=server.js.map