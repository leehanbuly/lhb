var express = require('express');
var v1 = express.Router();
var electronic_signature = require('./app/electronic_signature/electronic_signature');

v1.use('/app/electronic_signature', electronic_signature);

module.exports = v1;
