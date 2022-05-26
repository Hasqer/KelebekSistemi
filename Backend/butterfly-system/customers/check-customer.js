const mongoDb = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const DB = require('./../config/database.js').butterflySystemConfig;


function checkCustomer(emailInfo, passwordInfo, callback) {

    mongoDb.connect(DB.URL, function (err, client) {
      const db = client.db(DB.databaseName);
      db.collection(DB.collections.customers).findOne({email: emailInfo, password: passwordInfo}, (err, checkData) => {
        client.close();
        if(err) throw err;
        if (checkData) 
          return callback(true);
        else
          return callback(false);
      });
    })
  };


  
function checkCustomerEmail(emailInfo, callback) {

    mongoDb.connect(DB.URL, function (err, client) {
      const db = client.db(DB.databaseName);
      db.collection(DB.collections.customers).findOne({email: emailInfo}, (err, checkData) => {
        client.close();
        if(err) throw err;
        if (checkData) 
          return callback(true);
        else
          return callback(false);
      });
    })
  };



module.exports = {
    checkCustomer: checkCustomer,
    checkCustomerEmail: checkCustomerEmail
}

/*
Returns true if it exists in the database, false otherwise
*/