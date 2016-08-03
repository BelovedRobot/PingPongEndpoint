// Configure Azure DocumentDB
export var endpoint = 'https://hunt-logic.documents.azure.com:443/';
export var authKey = '1smpOBCNyZVhPgvcvW2zZG7UEYolkK7aUJ9Qi3Hg2kNecnF1EIlngw7xk4vWLhLN6AuzdlehlTlwlKoNLYrvRw==';

// Setup Database and Collection
export var dbDefinition = 'hunt-log';
// export var collectionDefinition = 'dev-hunt-log-app'; // Prod
export var collectionDefinition = 'dev-hunt-log-app'; // Dev

// Setup Blob Service
export var blobStorageAccount = 'huntlogstorage';
export var blobAccessKey = 'VYHF6hOob8AUdRg8Jsq9KRSG0MKl7H1j3StcXNlE40STQohGxLE5MNBDYV/fI0BDH3lHpRWdt2C7YbV5aI6N6Q==';
export var blobEndpoint = `https://${blobStorageAccount}.blob.core.windows.net/${blobFileContainer}/`;
export var blobFileContainer = 'hunt-log-app'; // Prod
// export var blobFileContainer = 'files-dev'; // Dev

// Configure iTunes Environment
export var iapSharedSecret : String = "d701b8ddde4c452380e1b4cea96672de";
export var iapValidationEndpoint : String = "https://sandbox.itunes.apple.com/verifyReceipt";
// export var iapValidationEndpoint : String = "https://buy.itunes.apple.com/verifyReceipt";