var express = require('express');
var membership = express.Router();
var result = require('./../../../../result.js');
var mail = require('./../../../../mail.js');

/*
*Log-in API
*Request
*email : electronic-signature user's ID &Fautho usage
*password : electronic-signature user's email -password
*Response
*session_id : session -> prevent redundent login
*/
membership.post('/login', function(req, res, next){
    var isValid = true;
    var validationError = {
        "name": 'ValidationError',
        "errors": {}
    };
    if (!req.body.email) {
        isValid = false;
        validationError.errors.email = { message: 'Email is empty' };
    }
    if (!req.body.password) {
        isValid = false;
        validationError.errors.password = { message: 'Password is empty' };
    }
    if (!isValid) return res.json(result.successFalse(validationError));
    else next();
},
 function(req, res){
   var userEmail = req.body.email;
   var userPassword = req.body.password;

 });

/*
*Log-out API
*Request
*Session id -> clear session table && enable log-in at other envirement
*Response
*if success log-out, return in result.json result = true.
*/
membership.post('/logout', function (req, res, next) {
  var isValid = true;
  var validationError = {
      "name": 'ValidationError',
      "errors": {}
  };
  if (!req.body.session_id) {
      isValid = false;
      validationError.errors.session_id = { message: 'Session is empty' };
  }
  if (!isValid) return res.json(result.successFalse(validationError));
  else next();
}, function(req, res){
    var userSession = req.body.session_id;

});

/*
*check_email API
*if new user join in electronic-signature service, new user should make new account.
*This account uses in only klaytnsori service.
*But user can send or receive from other accounts.
*Request
*email : new user's using email like ID.
*Response
*if success sign-up, return in result.json result = true.
*/

membership.post('/check_email', function(req, res, next){
    var isValid = true;
    var validationError = {
        "name": 'ValidationError',
        "errors": {}
    };

    if (!req.body.email){
        isValid = false;
        validationError.errors.email = { message: 'Email is empty' };
    }

    if (!isValid) return res.json(result.successFalse(validationError));
    else next();
}, function(req, res, next){
    var userEmail = req.body.email;

});

/*
*Find password API1
*if user forgot user's password, find the password.
*Request
*email : send authorize code to user's email.
*Response
*email : send e-amil.
*authorize_code : authorize code to identity user.
*/
membership.post('/find_pw_auth_code', function(req, res, next){
  var isValid = true;
  var validationError = {
      "name": 'ValidationError',
      "errors": {}
  };

  if (!req.body.email){
      isValid = false;
      validationError.errors.email = { message: 'Email is empty' };
  }
  if (!isValid) return res.json(result.successFalse(validationError));
  else next();
},function(req,res){
    var userEmail = req.body.email;

    var data = {
      email : userEmail,
      authorize_text : authorizeText
    };
    mail.transporter.sendMail(mail.mailOptionFindPw(userEmail,authorizeText), function(err, info){
      return res.json(result.successTrue(data));
    });

    var emailError = {
      "name": 'email',
      "errors": {}
    };
    emailError.errors.email = { message: 'Cannot find email in DB' };
    return res.json(result.successFalse(emailError));
});

/*
*Find password API2
*if user forgot user's password, find the password.
*email : To find matching password with email.
*authorize_code : check for user's identity.
*Request
*email : send authorize code to user's email.
*Response
*password : user's password
*/
membership.post('/find_pw_auth_identity', function (req, res, next) {
    var isValid = true;
    var validationError = {
        name: 'ValidationError',
        errors: {}
    };
    if(!req.body.email){
        isValid = false;
        validationError.errors.email = { message: 'Email is empty' };
    }
    if(!req.body.authorize_text){
        isValid = false;
        validationError.errors.authorize_text = { message: 'Authorize code is empty' };
    }
    if(!req.body.password){
      isValid = false;
      validationError.errors.password = { message: 'New password is empty' };
    }
    if(!isValid) return res.json(result.successFalse(validationError));
    else next();
},function(req, res, next){
  var userEmail = req.body.email;
  var userNewPassword = req.body.password;
  var string1 = req.body.authorize_text;

  var string2 = ;
  if(string1 != string2){
    var codeError = {
      "name": 'Authorize code Error',
      "errors": {}
    };
    codeError.errors.code = { message: 'Diffrent authorize text' };
    return res.json(result.successFalse(codeError));
  }
  else{
    //오류 처리
  }
});

/*
*Modify password API
*if user want to modify user's password.
*Request
*session_id : authorize user.
*password : change password.
*Response
*if success modify password, return in result.json result = true.
*/
membership.post('/modify_pw', function (req, res, next) {
    var isValid = true;
    var validationError = {
        name: 'ValidationError',
        errors: {}
    };
    if (!req.body.session_id) {
        isValid = false;
        validationError.errors.session_id = { message: 'Session Error' };
    }
    if(!req.body.password){
      isValid = false;
      validationError.errors.password = { message: 'Password is empty' };
    }
    if (!isValid) return res.json(result.successFalse(validationError));
    else next();
}, function (req, res) {
    var userSession = req.body.session_id;
    var newPassword = req.body.password;

});

/*
*signup API
*Request
*email : To authorize user's identity using random num
*passowrd : User use password.
*nickname : User's using name in service
*Response
*/
membership.post('/signup', function (req, res, next) {
    var isValid = true;
    var validationError = {
        name: 'ValidationError',
        errors: {}
    };
    if (!req.body.email) {
        isValid = false;
        validationError.errors.email = { message: 'Email is empty' };
    }
    if (!req.body.password){
        isValid = false;
        validationError.errors.password = { message: 'Password is empty' };
    }
    if(!req.body.nickname){
      isValid = false;
      validationError.errors.nickname = { message : 'Nickname is empty'}
    }
    if (!isValid) return res.json(result.successFalse(validationError));
    else next();
}, function (req, res, next) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    var userNickname = req.body.nickname;
    var authorizeText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6 ; i++) {
        authorizeText += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    var data = {
      "email" : userEmail,
      "password" : userPassword,
      "nickname" : userNickname,
      "authorize_text": authorizeText
    };
    mail.transporter.sendMail(mail.mailOptionSignup(userEmail,authorizeText), function(err, info){
      return res.json(result.successTrue(data));
    });
});

/*
*Authorize_signup API
*Request
*email : User's email to find matching code
*authorize_text : To authorize user's identity
*Response
*session_id : if success signup, return true
*/
membership.post('/authorize_signup', function (req, res, next) {
    var isValid = true;
    var validationError = {
        name: 'ValidationError',
        errors: {}
    };

    if(!req.body.email){
      isValid = false;
      validationError.errors.email = { message: 'email is empty' };
    }

    if(!req.body.authorize_text){
        isValid = false;
        validationError.errors.authorize_text = { message: 'Authorize code is empty' };
    }

    if(!isValid) return res.json(result.successFalse(validationError));
    else next();
},function(req, res, next){
  var userEmail = req.body.email;
  var string1 = req.body.authorizeText;

  var string2 = ;
  if(string1 == string2){

  }
  else{
    var codeError = {
      "name": 'Authorize code Error',
      "errors": {}
    };
    codeError.errors = { message: 'Diffrent authorize text' };
    return res.json(result.successFalse(codeError));
  }
});

module.exports = membership;
