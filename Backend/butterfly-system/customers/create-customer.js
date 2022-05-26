const mongoDb = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const DB = require('../config/database').butterflySystemConfig;

function createCustomer(nameInfo, surnameInfo, emailInfo, emailValidationCodeInfo, passwordInfo) {

    var customerObj = {
      name: nameInfo,
      surname: surnameInfo,
      email: emailInfo,
      emailValidationBool: false,
      emailValidationCode: emailValidationCodeInfo,
      password: passwordInfo,
      paidCustomer: false,
      licenseDeadline: "",
      createdTime: Date(Date.now()),
      modifiedTime: Date(Date.now())
    };
  
    mongoDb.connect(DB.URL, function (err, client) {
      if (err) throw err;
      const db = client.db(DB.databaseName);
      db.collection(DB.collections.customers).insertOne(customerObj, (error, data) => {
        client.close();
        if (err) throw err;
        console.log("1 customer document inserted");
      });
    });
  };

  module.exports = {
    createCustomer: createCustomer
  }
  