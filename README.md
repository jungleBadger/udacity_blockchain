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
  -d 'address=1EgfiAv7TL4hvZL6674oqRST7aiRLSrYLx&walletPassword=xxxxx&message=1EgfiAv7TL4hvZL6674oqRST7aiRLSrYLx%3A1533407314%3AstarRegistry'
``` 

#### Validate signature
```
curl -X POST \
  http://localhost:8000/message-signature/validate \
  -d 'address=1EgfiAv7TL4hvZL6674oqRST7aiRLSrYLx&signature=H0mI3eNV6Xr2AwA7Iek9A%2BnjjTFe9ycUz9HR7M8ZSwJ%2BHzT70TO84IEaBmmYTG5BLh5QrCDrdvtcVGsr%2B65ttYg%3D&message=1EgfiAv7TL4hvZL6674oqRST7aiRLSrYLx%3A1533407314%3AstarRegistry'
 ```
 
 ### This is  where I'm stuck. I could not generate a valid signature yet