# supplyChain
## Prerequisites:
check whether you have these prereqs as mentioned link below or else download the link
https://hyperledger-fabric.readthedocs.io/en/release/prereqs.html

Download the Binaries Of hyperledger Fabric Using the Command:
```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.1.1 1.4.7 0.4.20
```
## supported OS 
 - Mac
 - Linux


keep the bin inside supplyChain Folder

## Bringing-up the Fabric-Network and deploying Chaincodes in it

### get into the fabcar folder and run the script
```
cd fabcar/
run ./startFabric.sh
```
### run the middleware to interact with chaincode
```
cd javascript
npm install
node enrollAdmin.js
node registerUser.js
node invoke.js //Invoke Requests and create transaction 
node query.js  // query parts Data and Product details and also owner data 
```

## Ledger Data Folder 
  This folder contains World state Data in Couchdb ScreenShots and also the query Result ScreenShot
 ## Couchdb Explorer 
 To view world state in Couchdb
 Explorer address: http://{Host}:7984/_utils/#database/ 
 Replace host with IP address in which you are hosting the network
 
 



