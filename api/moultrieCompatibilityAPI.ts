var express = require('express');
var router = express.Router();
var documentDB = require('../data/documentDB');
var config = require('../data/config');
import _ = require("lodash");

// GET ../api/moultrie-compatibility
router.get('/moultrie-compatibility', function(req, res) {
    var compatibility = {
        endpoints: [
            { "1" : "https://consumerservice.moultriemobile.com" },
            { "2": "https://consumerservice.moultriemobile2.com" }
        ],
        Android: [
            { "1.1.8": "1" },
            { "1.1.9": "1" },
            { "2.0.0": "1" },
            { "2.1.0": "2" }
        ],
        iOS: [
            { "1.0.4": "1" },
            { "2.0.0": "1" },
            { "2.1.0": "2" }
        ]
    };

    res.status(200).json(compatibility);
});

module.exports = router;