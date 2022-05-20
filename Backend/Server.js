//Variables
var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoDb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 
const randomHash = require('random-hash');
const nodeMailer = require('nodemailer');
var XLSX = require("xlsx");
var fs = require("fs");



const { start } = require('repl');
const { Console } = require('console');

const domain = "localhost";

//Main settings
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', express.static('./../Frontend/public'));


//SSL Settings
const https = require('https');
const key = fs.readFileSync('./server-key.pem');
const cert = fs.readFileSync('./server-cert.pem');
const server = https.createServer({key: key, cert: cert }, app);
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

app.post('/createStudents', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const studentsFile = req.body.studentsFile;
  const readFileType = req.body.readFileType;

  if(email == undefined, password == undefined, studentsData == undefined, readFileType == undefined)
    res.send({check:'false'});

  checkCustomer(email, password, function (lastResult) { //Check customer
    if (lastResult == 'true') {
      getCustomer(email,password,function(result){ //Get CustomerId
        const customerId = result.id;
          createStudent(customerId,studentsFile,readFileType,function(createStudentsStatus){ //Create it to the database with the customer id and students excel data
            if(createStudentsStatus == 'true')
              res.send({check : 'true'});
            else if (createStudentsStatus == 'false')
              res.send({check : 'false'});
          });
      });

    } 
    else if (lastResult == 'false') {
      res.send({check: 'false'});
    }
  });
});

app.post('/getStudents', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  checkCustomer(email, password, function (result) {
    if (result == 'true') {
      getCustomer(email, password, function (customerJSON) {
        const customerId = customerJSON.id;
        getStudents(customerId,function(studentsJSON){
          res.send(studentsJSON);
        });
      });
  
    } else if (result == 'false') {
      res.send({
        check: 'false'
      });
    }
  });
});

app.post('/createSchoolClass', (req, res) => {


  const email = req.body.email;
  const password = req.body.password;
  const className = req.body.className;
  const classArrangement = req.body.classArrangement;
  const singleDesk= req.body.singleDesk;

  if(email == undefined, password == undefined, className == undefined, classArrangement == undefined, singleDesk == undefined)
    res.send({check:'false'});

    checkCustomer(email, password, function (lastResult) { //Check customer
      if (lastResult == 'true') {
        getCustomer(email,password,function(customerJSON){ //Get CustomerId
          const customerId = customerJSON.id;
          createSchoolClass(customerId,className,classArrangement,singleDesk,function(createSchoolClassStatus){
            if (createSchoolClassStatus=='true')
              res.send({check: 'true'}); //Successful create school class
            else (createSchoolClassStatus=='false')
              res.send({check: 'false'}); //Failed create school class
          });
        })
      }
      else if (lastResult == 'false') {
        res.send({check: 'false'});
      }});
});

 app.post('/getSchoolClasses', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  checkCustomer(email, password, function (result) {
    if (result == 'true') {
      getCustomer(email, password, function (customerJSON) {
        const customerId = customerJSON.id;
        getSchoolClass(customerId,function(schoolClassesJSON){
          res.send(schoolClassesJSON);
        });
      });
    } else if (result == 'false') {
      res.send({
        check: 'false'
      });
    }
  });
});


//Functions
//    Customer Functions
function checkCustomer(emailInfo, passwordInfo, callback) {
  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("customers").findOne({
      email: emailInfo,
      password: passwordInfo
    }, (err, data) => {
      client.close();
      if (data) {
        return callback('true');
      } else {
        return callback('false');
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
      client.close();
      if (data) {
        var getCustomerJSON = { //Creating result JSON 
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
      } else {
        return callback('false');
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
    createdTime: Date(Date.now()),
    modifiedTime: Date(Date.now())

  };

  mongoDb.connect(url, function (err, client) {
    if (err) throw err;
    var db = client.db("KelebekSistemi");

    db.collection("customers").insertOne(customerObj, (error, data) => {
      client.close();
      if (err) throw err;
      console.log("1 customer document inserted");
    });
  });
};

function checkCustomerId(customerIdInfo, callback) {
  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    
    var customerIdInfoObject = new ObjectId(customerIdInfo);

    db.collection("customers").findOne({
      _id:customerIdInfoObject
    }, (err, data) => {
      client.close();
      if (data) {
        return callback('true');
      } else {
        return callback('false');
      }
    });
  })
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
      client.close();
      if (data.matchedCount == "1")
        return callback(true);
      else if (data.matchedCount == "0")
        return callback(false);
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






//    Student Functions
function createStudent(customerIdInfoExcel,fileExcelStudents,readFileType,callback) {
/*
  var studentObj = {
    customerId:customerIdInfo,
    name: nameInfo,
    surname: surnameInfo,
    number: number,
    grade:grade,
    branch: branch,
    gender: gender,
    createdTime:Date(Date.now())
  };
*/
  readFromExcelStudents(customerIdInfoExcel,fileExcelStudents,readFileType, function(studentObj){
    console.log(studentObj);
    mongoDb.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db("KelebekSistemi");
  
      db.collection("students").insertMany(studentObj, (error, data) => {
        client.close();
        if (err) throw err;
        console.log("1 student document inserted");
        if(err) return callback('false'); //For frontend negative warning
        else return callback('true'); //For frontend positive warning
      });
    });
  });
};

function readFromExcelStudents(customerIdInfoExcel,fileExcelStudents,readFileType,callback){ //using by createStudent()

  var studentsJSON =[{}]; //Basic JSON for students save
  var workbook = XLSX.read(fileExcelStudents, {type:readFileType}); //Get excel
  var sheet_name_list = workbook.SheetNames; //Get Sheet Names
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); //Convert to JSON
  var excelRowsObjArr = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name_list]); // Calculate for excel row count
  var excelRowCount = excelRowsObjArr.length; //Get Excel Row Count 
  var currentBranch = "T.C.\\nMANİSA VALİLİĞİ\\nTurgutlu / Turgutlu Lisesi Müdürlüğü\\nAL -  9. Sınıf / A Şubesi (ALANI YOK) Sınıf Listesi "; //Default Branch Value (9 / A)
  
  for (let count = 3; count < excelRowCount; count++) { //Loop for all students
    
    var tempBranch = xlData[count]["T.C.\nMANİSA VALİLİĞİ\nTurgutlu / Turgutlu Lisesi Müdürlüğü\nAL -  9. Sınıf / A Şubesi (ALANI YOK) Sınıf Listesi "]; //Get branch and grade but complex
   
    if( tempBranch != undefined && tempBranch.toString().includes('T.C.')) // if "T.C." is changing it changes the variable
      currentBranch = tempBranch;
  
    var branchAndGrade = currentBranch.split('- ')[1]; //Get branch and grade from complex string
  
    if(branchAndGrade!=undefined){
      var studentGrade = Number(branchAndGrade.split('.')[0].trim()); // Grade parse from complex string
      var studentBranch = branchAndGrade.split('/ ')[1].split(' ')[0].trim(); // Branch parse from complex string
    }
  
    var studentNumber = xlData[count].__EMPTY; //Get Student Number 
    var studentName = xlData[count].__EMPTY_2; //Get Student Name 
    var studentSurname = xlData[count].__EMPTY_6; //Get Student Surname 
    var studentGender = xlData[count].__EMPTY_10; //Get Student Gender
  
    if(studentName == undefined || studentName == "Adı" ){
      continue;
    }
  
    studentsJSON[studentsJSON.length]={ // Students convert to JSON for database save
      customerId:customerIdInfoExcel,
      name:studentName,
      surname:studentSurname,
      number:studentNumber,
      grade:studentGrade,
      branch:studentBranch,
      gender:studentGender,
      createdTime:Date(Date.now)
    }; 
  };
  return callback (studentsJSON);
};

function getStudents(customerIdInfo, callback) {

  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("students").find({customerId:customerIdInfo}).toArray(function(err, data) {
      client.close();
      if (data) {
        /*
        var getStudentsJSON = { //Creating result JSON 
          name: data.name,
          surname: data.surname,
          number:data.number,
          grade:data.grade,
          branch:data.branch,
          id:data._id.toString(),
          customerId:data.customerId,
          created_time: data.createdTime
        };
        */
        
        return callback(data);
      } else {
        return callback('false');
      }
    });
  });
};




//    schoolClass Functions
function createSchoolClass(customerIdInfo,classNameInfo, classArrangementInfo, singleDeskInfo,callback) {

  var schoolClassObj = {
    customerId:customerIdInfo, //String
    className: classNameInfo, //String
    classArrangement: classArrangementInfo, //JSON
    singleDesk: singleDeskInfo, //Boolean
    createdTime: Date(Date.now()), 
    modifiedTime: Date(Date.now())
  };

  mongoDb.connect(url, function (err, client) {
    if (err) throw err;
    var db = client.db("KelebekSistemi");

    db.collection("schoolClasses").insertOne(schoolClassObj, (error, data) => {
      client.close();
      if (err) throw err;
      if(err) return callback ('false');
      else {
        console.log("1 school class document inserted");
        return callback ('true')
      };
    });
  });
};

function getSchoolClasses(customerIdInfo, callback) {

  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("schoolClasses").find({customerId:customerIdInfo}).toArray(function(err, data) {
      client.close();
      if (data) {
        /*
        var getStudentsJSON = { //Creating result JSON 
          name: data.name,
          surname: data.surname,
          number:data.number,
          grade:data.grade,
          branch:data.branch,
          id:data._id.toString(),
          customerId:data.customerId,
          created_time: data.createdTime
        };
        */

        return callback(data);
      } else {
        return callback('false');
      }
    });
  });
};

