"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentAPI_1 = __importDefault(require("./api/documentAPI"));
const lodash_1 = __importDefault(require("lodash"));
var app = express_1.default();
// Server is the backbone, the AppDelegate if you will. All setup here defines our endpoint 
// Endpoint Configuration
// ============================================================================= 
// Set our port
var port = process.env.PORT || 8282;
// Route Configuration
// =============================================================================
var router = express_1.default.Router();
// Configure the /api prefix to all routes
app.use('/api', router);
// Configure a test route to make sure everything is working (accessed at GET http://localhost:8484/api)
router.get('/', function (req, res) {
    res.status(200).send('Hello API');
});
// Add CORS Support
router.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization,origin,x-notify,notify-url,x-action');
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // If method is an OPTIONS requested
    if (req.method === "OPTIONS") {
        return res.status(200).send();
    }
    next(); // make sure we go to the next routes and don't stop here
});
// Optional to add a piece of middleware to use for all requests
router.use(function (req, res, next) {
    // Crude authentication, the token must be present
    if (lodash_1.default.has(req.headers, 'authorization')) {
        const tokenString = req.headers['authorization'];
        const tokenPrefix = "Token token=";
        let isAuthorized = true;
        // Does the prefix exist
        if (!tokenString.includes(tokenPrefix)) {
            isAuthorized = false;
        }
        // Get Token
        let prefixLength = tokenPrefix.length;
        const token = tokenString.substring(tokenPrefix.length);
        if (token.length <= 0) {
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
app.use('/api', documentAPI_1.default);
// Start the Server
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
//# sourceMappingURL=server.js.map