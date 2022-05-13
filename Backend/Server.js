var express = require("express");
var app = express();
const path = require('path');
var bodyParser = require("body-parser");
<<<<<<< HEAD
=======

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

>>>>>>> 4738f5088f8756bd2ad174dc0b97103a6543c024
//var fs = require("fs");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/public", express.static("./../Frontend/public"));
app.listen(process.env.PORT || 80);

<<<<<<< HEAD
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../Frontend/index.html'));
});

app.post('/home', (req, res) => {
        if(req.body.email == "test" && req.body.password == "test"){
            res.sendFile(path.join(__dirname + '/../Frontend/homepage.html'));
        }
});
=======
app.use("/public", express.static("./../Frontend/public"))


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../Frontend/index.html'));
});
>>>>>>> 4738f5088f8756bd2ad174dc0b97103a6543c024
