// ***** Settings for Dev
export var dbDefinition = 'focused-driver-app';
export var collectionDefinition = 'dev';
// export var blobFileContainer = 'dev'; // Dev

// ***** Settings for Prod
// export var dbDefinition = 'focused-driver-app';
// export var collectionDefinition = 'focused-driver-app';
// export var blobFileContainer = ''; // Prod


// Configure Azure DocumentDB
export var endpoint = 'https://focused-driver-db.documents.azure.com:443/';
export var authKey = 'OOujamAMUiOYWfN5Q0PxqhdpoVzBqX3LCuoeqIQx1cW9LLmCyXhNMdANprsiNHqXuLVQJAgX0DsIRGhTsx30Iw==';

// Setup Blob Service
// export var blobStorageAccount = 'huntlog';
// export var blobAccessKey = 'w9/Q9cv2pBkHsQ40sOwjT+C3xGSZY/nfNPtJyVaLnzk0xJcm6NM18m/flXacNo79NSIsYsi5i7TDTcZNiFr/cQ==';
// export var blobEndpoint = `https://${blobStorageAccount}.blob.core.windows.net/${blobFileContainer}/`;

// Configure Cryptography
export var cryptoKey = "53a738e847f63b92";
export var cryptoIv = "3ac8fd8cb2a87e56";

// Configure SendGrid
// export var sendGridKey = "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";