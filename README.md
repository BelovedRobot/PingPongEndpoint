# Testing Node Endpoint for PingPong Support by Beloved Robot

This project will create a simple API that the tests inside PingPong are configured to run against. The data is stored in memory on the node process, therefore this is strictly for local development and testing. However this application can be used as a base application for PingPong assuming the user will replace the data layer with a legitimate method of storage.

### Requirements
1. Must have node.js installed (developed with node v10.13.0 and npm v6.4.1)

### Running the server
1. Clone the repo
2. Run ```npm install```
3. Run ```npm run start```

### Default endpoints
- POST localhost:8282/api/document
- PUT localhost:8282/api/document/:id
- GET localhost:8282/api/document/:id
- DELETE localhost:8282/api/document/:id
- GET localhost:8282/api/document/all (returns all documents in cache)
