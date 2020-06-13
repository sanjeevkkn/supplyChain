/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const ProductManagement = require('./lib/productManagement');
const Ownership = require('./lib/ownership');

module.exports.ProductManagement  = ProductManagement ;
module.exports.contracts = [ ProductManagement];
