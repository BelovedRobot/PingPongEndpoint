import express from "express";
import documentAPI from "./api/documentAPI";
import _ from "lodash";
import bodyParser from 'body-parser';

var app = express();
// Server is the backbone, the AppDelegate if you will. All setup here defines our endpoint 

// Endpoint Configuration
// ============================================================================= 

// Set our port
var port = process.env.PORT || 8282;

// Configure bodyParser for getting data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route Configuration
// =============================================================================
var router = express.Router();

// Configure the /api prefix to all routes
app.use('/api', router); 

// Configure a test route to make sure everything is working (accessed at GET http://localhost:8484/api)
router.get('/', function(req, res) {
    res.status(200).send('Hello API');      
});

// Add CORS Support
router.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 
    'x-requested-with,content-type,authorization,origin,x-notify,notify-url,x-action');
    
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
router.use(function(req, res, next) {

    // Crude authentication, the token must be present
    if (_.has(req.headers, 'authorization')) {
        const tokenString = req.headers['authorization'];
        const tokenPrefix = "Token token=";
        
        let isAuthorized: boolean = true;
        
        // Does the prefix exist
        if (!tokenString.includes(tokenPrefix)) {
            isAuthorized = false;
        }
        
        // Get Token
        let prefixLength = tokenPrefix.length;
        const token: string = tokenString.substring(tokenPrefix.length);

        if (token.length <= 0) {
            isAuthorized = false;
        }
        
        if (!isAuthorized) {
            console.log("Auth failed");
            return res.status(401).send('Not Authorized');
        }
    } else {
        console.log("No header");
        return res.status(401).send('Not Authorized');
    }

    next(); // make sure we go to the next routes and don't stop here
});

// Additional Routes
app.use('/api', documentAPI);

// Start the Server
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);