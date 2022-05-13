var express = require("express");
var app = express();
const path = require('path');

//var bodyParser = require("body-parser");
//var fs = require("fs");
app.listen(process.env.PORT || 80);

app.use("/public", express.static("./public"))


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../Frontend/index.html'));
});


