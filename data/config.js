"use strict";
// Configure Azure DocumentDB
exports.endpoint = 'https://hunt-logic.documents.azure.com:443/';
exports.authKey = '1smpOBCNyZVhPgvcvW2zZG7UEYolkK7aUJ9Qi3Hg2kNecnF1EIlngw7xk4vWLhLN6AuzdlehlTlwlKoNLYrvRw==';
// Setup Database and Collection
exports.dbDefinition = 'hunt-log';
// export var collectionDefinition = 'dev-hunt-log-app'; // Prod
exports.collectionDefinition = 'dev-hunt-log-app'; // Dev
// Setup Blob Service
exports.blobStorageAccount = 'huntlogstorage';
exports.blobAccessKey = 'VYHF6hOob8AUdRg8Jsq9KRSG0MKl7H1j3StcXNlE40STQohGxLE5MNBDYV/fI0BDH3lHpRWdt2C7YbV5aI6N6Q==';
exports.blobEndpoint = `https://${exports.blobStorageAccount}.blob.core.windows.net/${exports.blobFileContainer}/`;
exports.blobFileContainer = 'hunt-log-app'; // Prod
// export var blobFileContainer = 'files-dev'; // Dev
// Configure iTunes Environment
exports.iapSharedSecret = "d701b8ddde4c452380e1b4cea96672de";
exports.iapValidationEndpoint = "https://sandbox.itunes.apple.com/verifyReceipt";
// export var iapValidationEndpoint : String = "https://buy.itunes.apple.com/verifyReceipt"; 
//# sourceMappingURL=config.js.map