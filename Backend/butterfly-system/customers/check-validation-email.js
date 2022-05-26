const mongoDb = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const DB = require('../config/database.js').butterflySystemConfig;

function checkValidationEmail(emailValidationCodeInfo, callback) {
    mongoDb.connect(DB.URL, function (err, client) {
      const db = client.db(DB.databaseName);
      db.collection(DB.collections.customers).updateOne({emailValidationCode: emailValidationCodeInfo}, {
        $set: {
          emailValidationBool: true,
          emailValidationCode: "Verified"
        }
      }, (err, changedData) => {
        client.close();
        if (changedData.matchedCount == "1")
          return callback(true); 
        else if (changedData.matchedCount == "0")
          return callback(false);
      });
    })
  };

module.exports = {
    checkValidationEmail: checkValidationEmail
}