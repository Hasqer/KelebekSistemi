//Variables
var express = require("express");
var app = express();
const path = require('path');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var fs = require("fs");

//Default settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static("./../Frontend/public"));
app.listen(process.env.PORT || 80);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://admin:Password12@cluster0.uqoht.mongodb.net/KelebekSistemi?retryWrites=true&w=majority');
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));




//Redirects
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/../Frontend/index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname + '/../Frontend/homepage.html'));
});

app.post('/checkUser', (req, res) => {
  if (req.body.email == "test@gmail.com" && req.body.password == "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08") {
    res.send({ check: "true" });
    console.log(req.body);
  }
  else {
    res.send({ check: "false" });
    console.log(req.body);
  }
});

app.post('/getUser', (req, res) => {
  if (req.body.email == "test@gmail.com" && req.body.password == "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08") {
    res.send({ userInfo: "Abdurrahman Rasim" });
  }
  else {
    res.send({ userInfo: "False" });
  }
});
/*
var check = checkUser('test@gmail.com', 'test');
check.then(function (result) {
  console.log(result);
});
*/

console.log(checkUser("test@gmail.com","9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"));

function checkUser(emailInfo, passwordInfo) {
  var status = '11111';
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function (status) {
    console.log("Connection Successful!");
    // define Schema
    var customersSchema = mongoose.Schema({
      name: String,
      surname: String,
      email: String,
      password: String,
      created_time: Date
    });
    // compile schema to model
    var customer = mongoose.model('Customer', customersSchema, 'customers');

    //Check
    var customerInfo = customer.findOne({ email: emailInfo, password: passwordInfo });
    customerInfo.exec(()=>{
      
    });/*
    customerInfo.then(result => {
        console.log(result);
    });*/
    /*
    customerInfo.then(result => {
      if (result) {
        status = 'False';
        console.log("girdi");
        return status;
      }
      else{
        status = 'False';
        return status;
      }
    });
    */
  })
  console.log("bir daha girdi");
};


function createUser(nameInfo, surnameInfo, emailInfo, passwordInfo) {

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function () {
    console.log("Connection Successful!");

    // define Schema
    var customersSchema = mongoose.Schema({
      name: String,
      surname: String,
      email: String,
      password: String,
      created_time: Date
    });

    // compile schema to model
    var customer = mongoose.model('Customer', customersSchema, 'customers');

    // new a document instance
    var customer1 = new customer({ name: nameInfo, surname: surnameInfo, email: emailInfo, password: passwordInfo, created_time: Date.now() });
    // save model to database
    customer1.save(function (err, customer) {
      if (err) return console.error(err);
      console.log(customer.name + " saved to customer collection.");
    });
  })

};