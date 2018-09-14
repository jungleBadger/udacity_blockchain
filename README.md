### About
This project is intended to demonstrated a simple private blockchain creation using models and helpers. It is ready to scale and build features on top of it

### Requirements
* [Node.js](https://nodejs.org)
* [NPM](https://www.npmjs.com)
* [LevelDB](https://github.com/google/leveldb)
* [ExpressJS](https://expressjs.com/)
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [bitcoinjs-lib](https://www.npmjs.com/package/bitcoinjs-lib)

### Installing dependencies

* From within project's root folder run `npm install`

### Dotenv

* The application relies (kind of) on a .env file located at the root folder. There are hardcoded values as OR clauses like the running HTTP port and cookie secrets that can be configured there but can be ignored  as it  is intended to be easier to be reviewed

### Running the app

* From within project's root folder run `node app.js` or `npm start` and it will init an already existent, or create a new blockchain and expose a HTTP server on port 8000

### HTTP endpoints (Part 1 & 2)

#### Create Block
```
curl -X POST \
  http://localhost:8000/block \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'body=teste!'
```

#### Get block by height
```
curl -X GET \
  http://localhost:8000/block/0
```

#### Get chain length
```
curl -X GET \
  http://localhost:8000/chainLength
```

#### Get the whole chain
```
curl -X GET \
  http://localhost:8000/chain
```

### Steps (Part 3)

#### Crete a wallet
```
curl -X POST \
  http://localhost:8000/wallet \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=dcerag%40br.ibm.com&password=xxxxx'
```

#### Retrieve wallet info if wanted
```
curl -X GET \
  http://localhost:8000/wallet?address=1PwMuefYvnVQdvVVUU1NAsRAXhbmmqNu8F \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=dcerag%40br.ibm.com&password=xxxxx'
```

#### Request operation validation
```
curl -X POST \
  http://localhost:8000/requestValidation \
  -d address=1EgfiAv7TL4hvZL6674oqRST7aiRLSrYLx
```
  
#### Sign message
```
curl -X POST \
  http://localhost:8000/signMessage \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'message=1E8J7Kg2BSCr2iQhgbBJH4bjyG5TtyuoxV%3A1533841583%3AstarRegistry&password=xxxxx&username=dcerag%40br.ibm.com'
``` 

#### Validate signature
```
curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'address=1PwMuefYvnVQdvVVUU1NAsRAXhbmmqNu8F
 ```
 
  
 
 #### Create Star
 ```
curl -X POST \
  http://localhost:8000/star \
  -H 'Content-Type: application/json' \
  -d '{
	"address": "1PwMuefYvnVQdvVVUU1NAsRAXhbmmqNu8F",
	"signature": "H0WgzFlIexaS5FDxQX1/9e2IGr9raeOVksFPiW/5kQUUQFSozoLhtE/ybiqWcHmfmIegBXHm07N4zgL3SePmELk=",
	"message": "1PwMuefYvnVQdvVVUU1NAsRAXhbmmqNu8F:1533844240:starRegistry",
	"body": {
		"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
	    "star": {
	      "ra": "16h 29m 1.0s",
	      "dec": "-26° 29'\'' 24.9",
	      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
	      "storyDecoded": "Found star using https://www.google.com/sky/"
	    }
	}
}
 ```
 
 
 #### Get star by height
 ```
 curl -X GET \
   http://localhost:8000/stars/:height \
   -H 'Content-Type: application/x-www-form-urlencoded' \
 ```

 #### Get star by address
 ```
 curl -X GET \
   http://localhost:8000/stars/address/:address \
   -H 'Content-Type: application/x-www-form-urlencoded' \
 ```

 #### Get star by hash
 ```
 curl -X GET \
   http://localhost:8000/stars/hash/:hash \
   -H 'Content-Type: application/x-www-form-urlencoded' \
 ```