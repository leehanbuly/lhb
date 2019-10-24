/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// HyperpnsNet specifc classes
const OfficeDocument = require('./document.js');
const DocumentList = require('./documentlist.js');

/**
 * A custom context provides easy access to list of all office documents
 */
class OfficeDocumentContext extends Context {

    constructor() {
        super();
        // All docs are held in a list of docs
        this.documentList = new DocumentList(this);
    }

}

/**
 * Define office document smart contract by extending Fabric Contract class
 *
 */
class OfficeDocumentContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.hyperpnsnet.officedocument');
    }

    /**
    */
    createContext() {
        return new OfficeDocumentContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     *
     * @param {Context} ctx the transaction context
     * @param {String} creator office document creator
     * @param {Integer} docNumber doc number for this creator
     * @param {String} createDateTime
     * @param {String} approveDateTime
     * @param {Integer} faceValue
    */
    async createDoc(ctx, creator, docNumber, createDateTime, approveDateTime, faceValue) {

        let doc = OfficeDocument.createInstance(creator, docNumber, createDateTime, approveDateTime, faceValue);

        // Smart contract, rather than doc, moves doc into CREATEDOC state
        doc.setCreateDoc();

        // Newly created document is approved by the creator
        doc.setApprover(creator);

        // Add the doc to the list of all similar office document in the ledger world state
        await ctx.documentList.addDocument(doc);

        // Must return a serialized doc to caller of smart contract
        return doc;
    }

    /**
     * send office document
     *
     * @param {Context} ctx the transaction context
     * @param {String} creator office document issuer
     * @param {Integer} docNumber
     * @param {String} currentApprover
     * @param {String} newApprover
     * @param {Integer} price
     * @param {String} sendDateTime
    */
    async sendDoc(ctx, creator, docNumber, currentApprover, newApprover, price, sendDateTime) {

        let documentKey = OfficeDocument.makeKey([creator, docNumber]);
        let doc = await ctx.documentList.getDocument(documentKey);

        // Validate current approver
        if (doc.getApprover() !== currentApprover) {
            throw new Error('Document ' + creator + docNumber + ' is not approved by ' + currentApprover);
        }

        // First buy moves state from CREATEDOC to SENDDOC
        if (doc.isCreateDoc()) {
            doc.setSendDoc();
        }

        // Check doc is not already APPROVEDOC
        if (doc.isSendDoc()) {
            doc.setApprover(newApprover);
        } else {
            throw new Error('Document ' + creator + docNumber + ' is not sending. Current state = ' +doc.getCurrentState());
        }

        await ctx.documentList.updateDocument(doc);
        return doc;
    }

    /**
     *
     * @param {Context} ctx the transaction context
     * @param {String} creator
     * @param {Integer} docNumber
     * @param {String} approvingApprover
     * @param {String} approveDateTime
    */
    async approveDoc(ctx, creator, docNumber, approvingApprover, approveDateTime) {

        let documentKey = OfficeDocument.makeKey([creator, docNumber]);

        let doc = await ctx.documentList.getDocument(documentKey);

        if (doc.isApproveDoc()) {
            throw new Error('Document ' + creator + docNumber + ' already approved');
        }

        if (doc.getApprover() === approvingApprover) {
            doc.setApprover(doc.getCreator());
            doc.setApproveDoc();
        } else {
            throw new Error('Approving Approver does not approve document' + creator + docNumber);
        }

        await ctx.documentList.updateDocument(doc);
        return doc;
    }

}

module.exports = OfficeDocumentContract;
