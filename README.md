# Standard Node Endpoint for PingPong Support by Beloved Robot

1. Copy the source down 

2. Depending on your dev environment you will need to install these type definitions
	- sudo typings install dt~lodash --save --global
	- sudo typings install dt~moment --save --global
	- sudo typings install dt~serve-static --save --global
	- sudo typings install dt~express-serve-static-core --save --global
	- sudo typings install dt~express --save --global
	- sudo typings install dt~node --save --global
	- sudo typings install dt~moment-node --save --global
	- sudo typings install dt~mime --save --global

3. Setup MS Azure DocumentDB Storage and Blob Storage

4. In ../data/config.ts update the storage endpoints and shared keys

5. In ../api/authenticationAPI.ts update the AES key and iv value with your own keys