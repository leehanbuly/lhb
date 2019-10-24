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
     * @param {String} docTitle
     * @param {String} docComment
     * @param {String} docSaveTime
     * @param {String} docCreator
     * @param {String} docApprover
     * @param {Boolean} bAuth
    */
    async createDoc(ctx, docTitle, docComment, docSaveTime, docCreator, docApprover, bAuth) {

        let doc = OfficeDocument.createInstance(docTitle, docComment, docSaveTime, docCreator, docApprover, bAuth);

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
     * @param {String} docTitle
     * @param {String} docComment
     * @param {String} docSaveTime
     * @param {String} docCreator
     * @param {String} docApprover
     * @param {Boolean} bAuth
    */
    async sendDoc(ctx, docTitle, docComment, docSaveTime, docCreator, docApprover, bAuth) {

        let documentKey = OfficeDocument.makeKey([creator, docNumber]);
        let doc = await ctx.documentList.getDocument(documentKey);

        // Validate current approver
        if (doc.getApprover() !== currentApprover) {
            throw new Error('Document is not approved');
        }

        // First buy moves state from CREATEDOC to SENDDOC
        if (doc.isCreateDoc()) {
            doc.setSendDoc();
        }

        // Check doc is not already APPROVEDOC
        /*
        if (doc.isSendDoc()) {
            doc.setApprover(newApprover);
        } else {
            throw new Error('Document ' + creator + docNumber + ' is not sending. Current state = ' +doc.getCurrentState());
        }
*/
        await ctx.documentList.updateDocument(doc);
        return doc;
    }
  }

    /**
     *
     * @param {Context} ctx the transaction context
     * @param {String} docTitle
     * @param {String} docComment
     * @param {String} docSaveTime
     * @param {String} docCreator
     * @param {String} docApprover
     * @param {Boolean} bAuth
    */
    async approveDoc(ctx, docTitle, docComment, docSaveTime, docCreator, docApprover, bAuth) {

        let documentKey = OfficeDocument.makeKey([??creator, ??docNumber]);

        let doc = await ctx.documentList.getDocument(documentKey);

        if (doc.isApproveDoc()) {
            throw new Error('Document ' + ??creator + ??docNumber + ' already approved');
        }

        if (doc.getApprover() === approvingApprover && doc.getbAuth() === false) {
            setbAuth(true);
        } else {
            throw new Error('approveDoc error');
        }

        await ctx.documentList.updateDocument(doc);
        return doc;
    }

}

module.exports = OfficeDocumentContract;
