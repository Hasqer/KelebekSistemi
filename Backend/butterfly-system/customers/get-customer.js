const mongoDb = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const DB = require('../config/database').butterflySystemConfig;

function getCustomer(emailInfo, passwordInfo, callback) {

    mongoDb.connect(DB.URL, function (err, client) {
      const db = client.db(DB.databaseName);
      db.collection(DB.collections.customers).findOne({email: emailInfo,password: passwordInfo}, (err, data) => {
        client.close();
        if(err) throw err;
        if (data) {
          const getCustomerJSON = { //Creating result JSON 
            id:data._id.toString(),
            name: data.name,
            surname: data.surname,
            email:data.email,
            emailVerificationBool:data.emailVerificationBool,
            paidCustomer:data.paidCustomer,
            licenseDeadline:data.licenseDeadline,
            createdTime: data.createdTime,
            modifiedTime:data.modifiedTime
          };
          return callback(getCustomerJSON);
        } 
        else 
          return callback('false'); 
      });
    })
  };

module.exports = {
  getCustomer: getCustomer
}
