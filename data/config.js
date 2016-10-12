// ***** Settings for Dev
// export var dbDefinition = 'hunt-log-dev';
// export var blobFileContainer = 'app-primary-dev'; // Dev
// export var iapValidationEndpoint : String = "https://sandbox.itunes.apple.com/verifyReceipt";
"use strict";
// ***** Settings for Prod
exports.dbDefinition = 'hunt-log';
exports.blobFileContainer = 'app-primary'; // Prod
exports.iapValidationEndpoint = "https://buy.itunes.apple.com/verifyReceipt";
// Configure Azure DocumentDB
exports.collectionDefinition = 'app-primary';
exports.endpoint = 'https://hunt-log-db.documents.azure.com:443/';
exports.authKey = 'Dgyb3LsgibgJSuJJjAFeVjrv14qreaR1NO9zPNDvvmDshabO6eCaCExdAhRDNUm6gL7GpAyebf5FwwbVnsU42g==';
// Setup Blob Service
exports.blobStorageAccount = 'huntlog';
exports.blobAccessKey = 'w9/Q9cv2pBkHsQ40sOwjT+C3xGSZY/nfNPtJyVaLnzk0xJcm6NM18m/flXacNo79NSIsYsi5i7TDTcZNiFr/cQ==';
exports.blobEndpoint = `https://${exports.blobStorageAccount}.blob.core.windows.net/${exports.blobFileContainer}/`;
// Configure iTunes Environment
exports.iapSharedSecret = "d701b8ddde4c452380e1b4cea96672de";
// Configure Cryptography
exports.cryptoKey = "53a738e847f63b92";
exports.cryptoIv = "3ac8fd8cb2a87e56";
// Configure SendGrid
exports.sendGridKey = "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";
//# sourceMappingURL=config.js.map