var mysql = require('mysql');
var db = {};
db.klaytndb = mysql.createConnection({
    host: 'hyperpns.mysql.database.azure.com',
    user: 'hyperpns@hyperpns',
    password: 'Hyper12345678!',
    port: 3306,
    database: 'hyperpnsdb'
});

db.selectUser = function (callback) {
  var sql = "SELECT userID FROM userinfo";
  db.klaytndb.query(sql,function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
          return callback(result);
      }
  });
}; // use

db.deleteSession = function (u_id, callback){
    var params = [u_id];
    var sql = "DELETE FROM usersession WHERE userID = ?";
    db.klaytndb.query(sql, params, function (err, result, fields) {
        if (err) {
            return callback(false);
        }
        else {
            return callback(true);
        }
    });
};

db.countSession = function (u_id, callback) {
    var params = [u_id];
    var sql = "SELECT count(session_id) as totals FROM usersession WHERE userID = ?";
    db.klaytndb.query(sql, params, function (err, result, fields) {
        if (result[0].totals) {
            return callback(true);
        }
        else {
            return callback(false);
        }
    });
};

db.checkIDandPW = function (u_id, u_pw, callback) {
  var params = [u_id, u_pw];
  var sql = "SELECT count(userID) as id FROM userinfo WHERE userID = ? AND password = ?";
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
        if(result[0].id){
          return callback(true);
        }
        else{
          return callback(false);
          }
      }
  });
};

db.maxSession = function (callback){
  var sql = "SELECT MAX(session_id) as max FROM usersession";
  db.klaytndb.query(sql, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
        return callback(result);
      }
  });
};

db.insertSession = function (session_id, u_id, callback){
  var sql = "INSERT INTO usersession (session_id ,userID) VALUES(?, ?)";
  var params = [session_id, u_email];
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
        return callback(true);
      }
    });
};

db.selectSession = function (u_id, callback){
  var sql = "SELECT session_id FROM usersession WHERE userID =?";
  var params = [u_id];
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
          return callback(result); // session_id 반환
      }
  });
};

db.login = function (u_id, u_pw, callback) {
  db.checkIDandPW(u_id, u_pw, (row1)=>{
    if (row1){
      db.countSession(u_id, (rows2)=>{ // session_id 존재할 경우 삭제하고 다시 배당
            if(rows2){
                db.deleteSession(u_id, (rows3)=>{
                    if(rows3){
                      db.maxSession((rows4)=>{
                        if (rows4) {
                          var session_id = rows4[0].max + 1;
                          db.insertSession(session_id, u_id, (rows5)=>{
                            if(rows5){
                              db.selectSession(u_id, (rows6)=>{
                                return callback(rows6); // session_id 반환
                              });
                            }
                            else{
                              return callback(false);
                            }
                          });
                        }
                        else {
                          return callback(false);
                        }
                      });
                      }
                    });
                  }
            else {
              db.maxSession((rows4)=>{
                if (rows4) {
                  var session_id = rows4[0].max + 1;
                  db.insertSession(session_id, u_id, (rows5)=>{
                    if(rows5){
                      db.selectSession(u_id, (rows6)=>{
                        return callback(rows6); // session_id 반환
                      });
                    }
                    else{
                      return callback(false);
                    }
                  });
                }
                else {
                  return callback(false);
                }
              });
              }
            });
          }
          else{
            return callback(false);
            }
  });
}; // use

db.countDocNumber = function(callback){
  var sql = "SELECT count(docNumber) as total FROM document";
  db.klaytndb.query(sql, function (err, result, fields) {
      if (result[0].total) {
        return callback(result);
      }
      else{
        return callback(false);
      }
    });
}; // use

db.insertDoc = function(docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, callback){
  var params = [docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover];
  var sql = "INSERT INTO document (docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover) VALUES (?, ?, ?, ?, ?, ?)";
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
        return callback(true);
      }
    });
};

db.selectID = function (session_id, callback){
  var sql = "SELECT userID FROM usersession WHERE session_id = ?";
  var params = [session_id];
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
        return callback(result);
      }
    });
}; // use

db.insertDocument = function (docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, callback){
    db.insertDoc(docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, (row)=>{
      return callback(true);
    });
}; // use

db.showMyDocment = function (docCreator, callback) {
  var params = [docCreator];
  var sql = "SELECT docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, isApproved FROM document WHERE docCreator = ?";
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
          return callback(result);
      }
  });
}; // use

db.selectDocment = function (docNumber, callback){
  var params = [docNumber];
  var sql = "SELECT docNumber, docTitle, docComment, docSaveTime, docCreator, docApprover, isApproved FROM document WHERE docNumber = ?";
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
          return callback(result);
      }
  });
}; // use

db. deleteDocument = function (docNumber, callback){
  var params = [docNumber];
  var sql = "DELETE FROM document WHERE docNumber = ?";
  db.klaytndb.query(sql, params, function (err, result, fields) {
      if (err) {
          return callback(false);
      }
      else {
          return callback(true);
      }
  });
}; // use

module.exports = db;
