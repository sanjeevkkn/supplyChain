'use strict';
const { Contract } = require('fabric-contract-api');

class Ownership extends Contract{
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }  
    async setOwner(ctx, id , owner) {
        console.info('============= START : setOwner ===========');
        
       if (ctx.stub.invokeChaincode("productManagement",["validatePart", id]) === false){
        throw new Error(`${id} does not exist`);
       }
       if (this.validateOwnership(ctx,id,"ford") == true){
        throw new Error(`owner for ${id} already exist`);
       }
        const part = {
            id,
            owner,
        };

        await ctx.stub.putState("owner-"+id, Buffer.from(JSON.stringify(part)));
        console.info('============= END :setOwner ===========');
    }
   

    async changeOwner(ctx, id , newOwner) {
        console.info('============= START : changeOwner ===========');

        const pOAsBytes = await ctx.stub.getState("owner-"+id); // get the car from chaincode state
        if (!pOAsBytes || pOAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const pO = JSON.parse(pOAsBytes.toString());
        if (pO.owner == newOwner){
            throw new Error("new owner could not be similar current owner")
        }
        pO.owner = newOwner;
        console.info(JSON.stringify(pO))
        await ctx.stub.putState("owner-"+id, Buffer.from(JSON.stringify(pO)));
        console.info('============= END : changeOwner ===========');

    }
    async OwnerHistory(ctx, id) {
        console.info('============= START : OwnerHistory ===========');

        // get the car from chaincode state
        const historyResults = [];
        
        for await (const {key, value} of ctx.stub.getHistoryForKey("owner-"+id)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            historyResults.push({ Key: key, Record: record });
        }
        console.info(historyResults);
        return JSON.stringify(historyResults);

    }
    async queryOwner(ctx, partId) {
        const pOAsBytes= await ctx.stub.getState("owner-"+partId); // get the part from chaincode state
        if (!pOAsBytes || pOAsBytes.length === 0) {
            throw new Error(`${partId} not  exist`);;
        }
        console.log(pOAsBytes.toString());
        // const part = JSON.parse(pOAsBytes.toString())
           
        return pOAsBytes.toString();
    }
    async validateOwnership(ctx, partId,owner) {
        const pOAsBytes= await ctx.stub.getState("owner-"+partId); // get the partOwner from chaincode state
        if (!pOAsBytes || pOAsBytes.length === 0) {
            return false;
        }
        const partOwner = JSON.parse(pOAsBytes.toString())
        if (partOwner.owner != owner){
            return false;
        }
        console.log(pOAsBytes.toString());
        return true;
    }
   
}
module.exports = Ownership;