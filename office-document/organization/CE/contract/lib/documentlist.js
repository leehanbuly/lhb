/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const OfficeDocument = require('./document.js');

class DocumentList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.hyperpnsnet.officedocumentlist');
        this.use(OfficeDocument);
    }

    async addDocument(doc) {
        return this.addState(doc);
    }

    async getDocument(documentKey) {
        return this.getState(documentKey);
    }

    async updateDocument(doc) {
        return this.updateState(doc);
    }
}


module.exports = DocumentList;
