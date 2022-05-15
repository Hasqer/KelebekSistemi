//Variables
var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

//Main settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('./../Frontend/public'));
app.listen(process.env.PORT || 80);

//Database settings
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




//Functions

function checkCustomer(emailInfo, passwordInfo, callback) {
  db.once('open', function (status) {
    console.log('Connection Successful!');
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

    //Check from database
    var customerInfo = customer.findOne({ email: emailInfo, password: passwordInfo }, function (err, data) {
      if(data)
        return callback('true');
      else
        return callback('false');
        /*
          Example CheckCustomer Code Block
          checkCustomer('test@gmail.com','test',function(response) {
            console.log(response);
          });
        */  
    });
  })};


function getCustomer(emailInfo, passwordInfo,callback)
{
  console.log('girid');
  db.once('open', function (status) {
    console.log('Connection Successful!');
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
    //Check from database
    var customerInfo = customer.findOne({ email: emailInfo, password: passwordInfo }, function (err, data) {
      if(data){
        //return callback(data.name,data.surname,created_time);
        var getCustomerJSON = {name: data.name,surname:data.surname,created_time:data.created_time};
        return callback(getCustomerJSON);
      }
      else{
        return callback('false');
        /*
        getCustomer('test@gmail.com','test',function(result) {
          res.send(result);
        });
        */
      }});
  })};


function createCustomer(nameInfo, surnameInfo, emailInfo, passwordInfo) {

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function () {
    console.log('Connection Successful!');

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
      console.log(customer.name + ' saved to customer collection.');
    });
  })
};