var express = require('express');
var userInfo = express.Router();
var result = require('./../../../../result.js');
var mail = require('./../../../../mail.js');

/*
*userInfo API
*Request
*session_id : Get user's information at DB
*Response
*user_department : Return user's department from DB.
*/
userInfo.get('/',function(req,res,next){
  var isValid = true;
  var validationError = {
    name : 'ValidationError',
    errors : {}
  };

  if(!req.query.session_id){
    isVlid = false;
    validationError.errors.session_id = { message : 'Session Error'};
  }

  if(!isValid) return res.json(result.successFalse(validationError));
  else next();
}, function(req, res){
  var userSession = req.query.session_id;

});

/*
*my_document_list API
*Request
*session_id : Get user's document information at DB
*Response
*document_id : document number
*document_title : User inserted document title
*document_content : User inserted document content
*document_state : Present state
*/
userInfo.get('/my_document_list', function(req,res,next){
  var isValid = true;
  var validationError = {
    name : 'ValidationError',
    errors : {}
  };
  if(!req.query.session_id){
    isVlid = false;
    validationError.errors.session_id = { message : 'Session Error'};
  }
  if(!isValid) return res.json(result.successFalse(validationError));
  else next();
}, function(req,res,next){
  var userSession = req.query.session_id;

});

/*
*my_signature_list API
*Request
*session_id : Get user's signature information at DB
*Response
*document_title : document's title that user inserted signature
*document_state : document's state that user inserted signature
*/
userInfo.get('/my_signature_list', function(req,res,next){
  var isValid = true;
  var validationError = {
    name : 'ValidationError',
    errors : {}
  };

  if(!req.query.session_id){
    isVlid = false;
    validationError.errors.session_id = { message : 'Session Error'};
  }

  if(!isValid) return res.json(result.successFalse(validationError));
  else next();
}, function(req,res,next){
  var userSession = req.query.session_id;

});

module.exports = userInfo;
