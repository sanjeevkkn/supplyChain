/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const{OwnerShip} = require('./ownership');

class ProductManagement extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }    
    async buildPart(ctx, partName, partId) {
        const partAsBytes = await ctx.stub.getState(partId); // get the car from chaincode state
        if ( partAsBytes.length !== 0) {
            throw new Error(`${partId} already  exist`);
        }

        console.info('============= START : Create Part ===========');

        const part = {
            partName,
            partId,
            assembled : false
        };

        await ctx.stub.putState(partId, Buffer.from(JSON.stringify(part)));
        console.info('============= END : Create Part ===========');
    }

    async buildProduct(ctx, productId, wheelId,engineId,transmissionId) {
        const productAsBytes = await ctx.stub.getState(productId); // get the car from chaincode state
        if ( productAsBytes.length !== 0) {
            throw new Error(`${productId} already  exist`);
        }
        console.info('============= START : Create Product ===========');
        const args = [wheelId,engineId,transmissionId]
        var i;
        for (i of args){
            let partBool = await this.validatePart(ctx,i);
            let partOwnerBool=await ctx.stub.invokeChaincode("ownerShip",["validateOwnership", i , "ford"]);
            if (!partBool || !partOwnerBool){
                throw new Error(`${i} doesnot  exist or owner is different`);
            }

        }
        const part = {
            productId,
            wheelId,
            engineId,
            transmissionId
        };
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(part)));
        for (i of args){
            await this.partsAssembled(ctx,i);
        }
        console.info('============= END : Create Product ===========');
    }
    
    async validatePart(ctx, partId) {
        const pOAsBytes= await ctx.stub.getState(partId); // get the part from chaincode state
        if (!pOAsBytes || pOAsBytes.length === 0) {
            return false;
        }
        console.log(pOAsBytes.toString());
        const part = JSON.parse(pOAsBytes.toString())
        if (part.assembled){
            return false;
        }
           
        return true;
    }

    async queryByKey(ctx, partId) {
        const pOAsBytes= await ctx.stub.getState(partId); // get the part from chaincode state
        if (!pOAsBytes || pOAsBytes.length === 0) {
            throw new Error(`${partId} not  exist`);;
        }
        console.log(pOAsBytes.toString());
        // const part = JSON.parse(pOAsBytes.toString())
           
        return pOAsBytes.toString();
    }
    async partsAssembled(ctx, partId) {
        const pOAsBytes= await ctx.stub.getState(partId); // get the part from chaincode state
        console.log(pOAsBytes.toString());
        const part = JSON.parse(pOAsBytes.toString())
        part.assembled = true;
        await ctx.stub.putState(partId, Buffer.from(JSON.stringify(part)));
    }


}

module.exports = ProductManagement;
