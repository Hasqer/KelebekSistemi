var express = require("express");
var app = express();
const path = require('path');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//var fs = require("fs");
app.listen(process.env.PORT || 80);

app.use("/public", express.static("./../Frontend/public"))


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../Frontend/index.html'));
});
