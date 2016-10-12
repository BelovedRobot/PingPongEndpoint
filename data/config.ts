// ***** Settings for Dev
// export var dbDefinition = 'hunt-log-dev';
// export var blobFileContainer = 'app-primary-dev'; // Dev
// export var iapValidationEndpoint : String = "https://sandbox.itunes.apple.com/verifyReceipt";

// ***** Settings for Prod
export var dbDefinition = 'hunt-log';
export var blobFileContainer = 'app-primary'; // Prod
export var iapValidationEndpoint : String = "https://buy.itunes.apple.com/verifyReceipt";

// Configure Azure DocumentDB
export var collectionDefinition = 'app-primary';
export var endpoint = 'https://hunt-log-db.documents.azure.com:443/';
export var authKey = 'Dgyb3LsgibgJSuJJjAFeVjrv14qreaR1NO9zPNDvvmDshabO6eCaCExdAhRDNUm6gL7GpAyebf5FwwbVnsU42g==';

// Setup Blob Service
export var blobStorageAccount = 'huntlog';
export var blobAccessKey = 'w9/Q9cv2pBkHsQ40sOwjT+C3xGSZY/nfNPtJyVaLnzk0xJcm6NM18m/flXacNo79NSIsYsi5i7TDTcZNiFr/cQ==';
export var blobEndpoint = `https://${blobStorageAccount}.blob.core.windows.net/${blobFileContainer}/`;

// Configure iTunes Environment
export var iapSharedSecret : String = "d701b8ddde4c452380e1b4cea96672de";

// Configure Cryptography
export var cryptoKey = "53a738e847f63b92";
export var cryptoIv = "3ac8fd8cb2a87e56";

// Configure SendGrid
export var sendGridKey = "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";