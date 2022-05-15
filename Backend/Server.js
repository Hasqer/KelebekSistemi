var express = require("express");
var app = express();
const path = require('path');
var bodyParser = require("body-parser");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static("./../Frontend/public"));
app.listen(process.env.PORT || 80);


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



/*
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE users (id bigint(20) primary key identity,name VARCHAR(255),surname VARCHAR(255), email VARCHAR(255), phone VARCHAR(255), created_time date, modified_time date, premium bit)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});
*/