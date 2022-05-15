//Variables
var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoDb = require('mongodb').MongoClient;
const randomHash = require('random-hash');
const nodeMailer = require('nodemailer');
const domain = "localhost";

//Main settings
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', express.static('./../Frontend/public'));
app.listen(process.env.PORT || 80);

//Database settings
const url = 'mongodb+srv://admin:Password12@cluster0.uqoht.mongodb.net/test';

//Mail settings
let mailTransporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kelebeksistem@gmail.com',
    pass: 'Butterfly123'
  }
});











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

  checkCustomer(email, password, function (result) {
    if (result == 'true') {
      res.send({
        check: 'true'
      });
    } else if (result == 'false') {
      res.send({
        check: 'false'
      });
    }
  });
});

app.post('/getCustomer', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  checkCustomer(email, password, function (result) {
    if (result == 'true') {
      getCustomer(email, password, function (result) {
        res.send(result);
      });
    } else if (result == 'false') {
      res.send({
        check: 'false'
      });
    }
  });
});

app.post('/createCustomer', (req, res) => {

  if (req.body.nameInfo!="" && req.body.surnameInfo!="" && req.body.emailInfo!="" && req.body.passwordInfo!="") {
    const randomVerificationCode = randomHash.generateHash({length: 15});
    createCustomer(req.body.nameInfo, req.body.surnameInfo, req.body.emailInfo, randomVerificationCode, req.body.passwordInfo);
    verificationMailSend("http://" + domain + "/emailVerification/" + randomVerificationCode,req.body.emailInfo);
    res.send({check: 'true'}); //Successful SignUp
  }
  else {
    res.send({check: 'false'}); //Failed SignUp
  }
});

app.get('/emailVerification/:emailVerificationCode', (req, res) => {

  const emailVerificationCode = req.params.emailVerificationCode;
  emailVerificationCheck(emailVerificationCode, function (result) {
    if (result == false)
      res.send({
        check: "false"
      });
    else if (result == true)
      res.send({
        check: "true"
      });
  });
});











//Functions
function checkCustomer(emailInfo, passwordInfo, callback) {
  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("customers").findOne({
      email: emailInfo,
      password: passwordInfo
    }, (err, data) => {

      if (data) {
        callback('true');
        client.close();
      } else {
        callback('false');
      }
    });
  })
};

function getCustomer(emailInfo, passwordInfo, callback) {

  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("customers").findOne({
      email: emailInfo,
      password: passwordInfo
    }, (err, data) => {
      if (data) {
        var getCustomerJSON = {
          name: data.name,
          surname: data.surname,
          email:data.email,
          emailVerificationBool:data.emailVerificationBool,
          paidCustomer:data.paidCustomer,
          licenseDeadline:data.licenseDeadline,
          created_time: data.createdTime
        };
        return callback(getCustomerJSON);
        client.close();
      } else {
        callback('false');
        client.close();
      }
    });
  })
};

function createCustomer(nameInfo, surnameInfo, emailInfo, emailVerificationCodeInfo, passwordInfo) {

  var customerObj = {
    name: nameInfo,
    surname: surnameInfo,
    email: emailInfo,
    emailVerificationBool: false,
    emailVerificationCode: emailVerificationCodeInfo,
    password: passwordInfo,
    paidCustomer: false,
    licenseDeadline: "",
    createdTime: Date(Date.now())
  };

  mongoDb.connect(url, function (err, client) {
    if (err) throw err;
    var db = client.db("KelebekSistemi");

    db.collection("customers").insertOne(customerObj, (error, data) => {
      if (err) throw err;
      console.log("1 document inserted");
      client.close();
    });
  });
};

function emailVerificationCheck(emailVerificationCodeCheck, callback) {
  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("customers").updateOne({
      emailVerificationCode: emailVerificationCodeCheck
    }, {
      $set: {
        emailVerificationBool: true,
        emailVerificationCode: "Verified"
      }
    }, (err, data) => {
      if (data.matchedCount == "1")
        callback(true);
      else if (data.matchedCount == "0")
        callback(false);
    });
  })
};

function verificationMailSend(verificationLink,verificationMail) {

  let mailDetails = {
    from: 'Kelebek Sistemi <kelebeksistem@gmail.com>',
    to: verificationMail,
    subject: 'Kelebek Sistemi e-posta adresinizi doğrulayın',
    text: `Kelebek Sistemi e-posta adresinizi doğrulamak için aşağıdaki linke tıklayabilirsiniz. 
    Doğrulama Linki = ` + verificationLink
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent successfully');
    }
  });
};