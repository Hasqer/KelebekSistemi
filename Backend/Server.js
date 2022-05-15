//Variables
var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoDb = require('mongodb').MongoClient;
const randomHash = require('random-hash');

//Main settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('./../Frontend/public'));
app.listen(process.env.PORT || 80);

//Database settings
// Connection URL
const url = 'mongodb+srv://admin:Password12@cluster0.uqoht.mongodb.net/test';






//Redirects
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/../Frontend/index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname + '/../Frontend/homepage.html'));
});

app.post('/checkCustomer', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  checkCustomer(email,password,function(result) {
    if(result == 'true'){
      res.send({ check: 'true' });
    }
    else if(result == 'false'){
      res.send({ check: 'false' });
    }
  });
});

app.post('/getCustomer', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  
  checkCustomer(email,password,function(result) {
    if(result == 'true'){
      getCustomer(email,password,function(result) {
        res.send(result);
      });
    }
    else if(result == 'false'){
      res.send({ check: 'false' });
    }
  });
});

app.post('/createCustomer', (req, res) => {

  if(req.body.nameInfo && req.body.surnameInfo && req.body.emailInfo && req.body.passwordInfo){
    const randomVerificationCode = randomHash.generateHash({ length: 15 });
    createCustomer(req.body.nameInfo,req.body.surnameInfo,req.body.emailInfo,randomVerificationCode,req.body.passwordInfo);
    res.send({ check: 'true' }); //Successful SignUp
    //CODE MAİL WILL SEND HERE
  }
  else{
    res.send({ check: 'false' }); //Failed SignUp
  }
});

app.get('/emailVerification/:verificationCodeCheck', (req, res) => {
  checkCustomer('test@gmail.com','test');
  
  //emailVerificationCheck("Verified");
  //res.end();

  //res.redirect('/');
});




//Functions
function checkCustomer(emailInfo, passwordInfo, callback) {
    mongoDb.connect(url,function(err,client){
    const db = client.db("KelebekSistemi");
    db.collection("customers").findOne({ email: emailInfo, password: passwordInfo },(err,data)=>{
    if(data)
       callback('true');
    else
       callback('false');
  });
  })};


function getCustomer(emailInfo, passwordInfo,callback)
{

  mongoDb.connect(url,function(err,client){
    const db = client.db("KelebekSistemi");
    db.collection("customers").findOne({ email: emailInfo, password: passwordInfo },(err,data)=>{
    if(data){
        var getCustomerJSON = {name: data.name,surname:data.surname,created_time:data.created_time};
        return callback(getCustomerJSON);
    }
    else{
        callback('false');
    }
  });
  })};



function createCustomer(nameInfo, surnameInfo, emailInfo,emailVerificationCodeInfo, passwordInfo) {


    mongoDb.connect(url,function(err,client){
    const db = client.db("KelebekSistemi");
    var customerObj = {
      name: nameInfo,
      surname: surnameInfo,
      email: emailInfo,
      emailVerificationBool:false,
      emailVerificationCode:emailVerificationCodeInfo,
      password: passwordInfo,
      paidCustomer:false,
      licenseDeadline:"",
      created_time: Date.now()};
    db.collections("customers").insertOne(customerObj,(err,data)=>{
    if(data){
        
        return callback(getCustomerJSON);
    }
    else{
        callback('false');
    }
  });
  })};



function emailVerificationCheck(emailVerificationCodeCheck) {
  



  mongoDb.connect(url,function(err,client){
    const db = client.db("KelebekSistemi");
    var verifiedEmail 
    db.collection("customers").updateOne({ email: emailInfo, password: passwordInfo },(err,data)=>{
    if(data){
        var getCustomerJSON = {name: data.name,surname:data.surname,created_time:data.created_time};
        return callback(getCustomerJSON);
    }
    else{
        callback('false');
    }
  });
})};




/*


    var customerInfo = customer.findOneAndUpdate({ emailVerificationCode:emailVerificationCodeCheck },{$set:{emailVerificationBool:false,emailVerificationCode:"Verified"}}, function (err, data) {
      console.log("Onaylandı");
    });
  })};
 */
