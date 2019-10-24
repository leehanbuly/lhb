/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate Office Document state values
const odState = {
    CREATEDOC: 1,
    SENDDOC: 2,
    APPROVEDOC: 3
};


/**
 * OfficeDocument class extends State class
 * Class will be used by application and smart contract to define a document
 */
class OfficeDocument extends State {

    constructor(obj) {
      super(OfficeDocument.getClass(), [obj.docCreator, obj.docNumber]);
      Object.assign(this, obj);
    }

    getCreator() {
        return this.docCreator;
    }

    setCreator(newCreator) {
        this.docCreator = newCreator;
    }

    getApprover() {
        return this.Approver;
    }

    setApprover(newApprover) {
        this.Approver = newApprover;
    }

    /**
     * Useful methods to encapsulate office document states
     */
    setCreateDoc() {
        this.currentState = odState.CREATEDOC;
    }

    setSendDoc() {
        this.currentState = odState.SENDDOC;
    }

    setApproveDoc() {
        this.currentState = odState.APPROVEDOC;
    }

    isCreateDoc() {
        return this.currentState === odState.CREATEDOC;
    }

    isSendDoc() {
        return this.currentState === odState.SENDDOC;
    }

    isApproveDoc() {
        return this.currentState === odState.APPROVEDOC;
    }

    setbAuth(newbAuth) {
      this.bAuth = newbAuth;
    }

    getbAuth(){
      return this.bAuth;
    }

    static fromBuffer(buffer) {
        return OfficeDocument.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to office document
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, OfficeDocument);
    }

    /**
     * Factory method to create a office document object
     */
    static createInstance(docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, bAuth) {
        return new OfficeDocument({ docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, bAuth });
    }

    static getClass() {
        return 'org.hyperpnsnet.officedocument';
    }
}

module.exports = OfficeDocument;
