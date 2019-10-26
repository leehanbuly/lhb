var express = require('express');
var electronic_signature = express.Router();
var membership = require('./membership/membership');
var userInfo = require('./userInfo/userInfo');
var documents = require('./document/documents');

electronic_signature.use('/membership', membership);
electronic_signature.use('/userInfo', userInfo);
electronic_signature.use('/document', documents);

module.exports = electronic_signature;
