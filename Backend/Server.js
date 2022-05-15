//Variables
var express = require("express");
var app = express();
const path = require('path');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Default settings
app.use(bodyParser.urlencoded({extended:false}));
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
  if (req.body.email == "test@gmail.com" && req.body.password == "test") {
    res.send({ check: "True" });
    console.log(req.body);
  }
  else {
    res.send({ check: "False" });
    console.log(req.body);
  }
});

app.post('/getUser', (req, res) => {
  if (req.body.email == "test@gmail.com" && req.body.password == "test") {
    res.send({ userInfo: "Abdurrahman Rasim" });
  }
  else {
    res.send({ userInfo: "False" });
  }
});

var check = checkUser('test@gmail.com','test');
check.then(function(result) {
    console.log(result);
});



async function checkUser(emailInfo,passwordInfo){
var status = '11111';
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(status) {
    console.log("Connection Successful!");

    // define Schema
    var customersSchema = mongoose.Schema({
      name: String,
      surname: String,
      email: String,
      password: String,
      created_time:Date
    });

    // compile schema to model
    var customer = mongoose.model('Customer', customersSchema, 'customers');

    //Check
    var customerInfo = customer.findOne({ email: emailInfo, password:passwordInfo }).exec();
    customerInfo.then(function(result) {
        if(result){
            status = 'False';
            console.log("girdi");
        }
        else
            status = 'False';
     });
})
console.log("bir daha girdi");

return status;
};


function createUser(nameInfo,surnameInfo,emailInfo,passwordInfo){

    db.on('error', console.error.bind(console, 'connection error:'));
 
    db.once('open', function() {
        console.log("Connection Successful!");
         
        // define Schema
        var customersSchema = mongoose.Schema({
          name: String,
          surname: String,
          email: String,
          password: String,
          created_time:Date
        });    
    
        // compile schema to model
        var customer = mongoose.model('Customer', customersSchema, 'customers');
        
        // new a document instance
        var customer1 = new customer({ name: nameInfo,surname : surnameInfo,email: emailInfo, password: passwordInfo,created_time: Date.now()});
        // save model to database
        customer1.save(function (err, customer) {
          if (err) return console.error(err);
          console.log(customer.name + " saved to customer collection.");
        });
    })

};