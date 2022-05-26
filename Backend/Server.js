//Variables
var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoDb = require('mongodb').MongoClient; //kaldırılacak
var ObjectId = require('mongodb').ObjectId; //kaldırılacak
const randomHash = require('random-hash'); //kaldırılacak
var XLSX = require("xlsx"); //kaldırılacak
var fs = require("fs"); //kaldırılacak

const {checkCustomer, checkCustomerEmail} = require('./butterfly-system/customers/check-customer.js');
const {getCustomer} = require('./butterfly-system/customers/get-customer.js');
const {createCustomer} = require('./butterfly-system/customers/create-customer.js');
const {sendValidationEmail} = require('./butterfly-system/customers/send-validation-email.js');
const {checkValidationEmail} = require('./butterfly-system/customers/check-validation-email.js');

const { start} = require('repl'); //kaldırılacak
const { Console} = require('console'); //kaldırılacak

const domain = "localhost"; //kaldırılacak

//Main settings
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', express.static('./../Frontend/public'));


//SSL Settings
const https = require('https');
const key = fs.readFileSync('./ssl-certificates/server-key.pem');
const cert = fs.readFileSync('./ssl-certificates/server-cert.pem');
const server = https.createServer({key: key,cert: cert}, app);
app.listen(process.env.PORT || 80); // http : app | https : server
const protocol = 'http://';

//Database settings
const url = 'mongodb+srv://admin:Password12@cluster0.uqoht.mongodb.net/test';













//Redirects
app.get('/', function (req, res) {
  res.status(200).sendFile(path.join(__dirname + '/../Frontend/index.html'));
});

app.get('/home', (req, res) => {
  res.status(200).sendFile(path.join(__dirname + '/../Frontend/home-page.html'));
});

app.post('/checkCustomer', (req, res) => {
  const {email, password} = req.body;
  checkCustomer(email, password, function (checkStatus) {
     (checkStatus) ? res.status(200).send({check: 'true'}) : res.status(404).send({check: 'false'}) 
  });
});

app.post('/getCustomer', (req, res) => {

  const {email, password} = req.body;

  checkCustomer(email, password, function (checkStatus) {
    if (checkStatus == true)
      getCustomer(email, password, function (result) {
        res.status(200).send(result);
    });
    else if (checkStatus == false)
      res.status(404).send({check: 'false'});
  });
});

app.post('/createCustomer', (req, res) => {

  const {name, surname,email,password} = req.body; //Güncellenmeli Frontend'den

  let checkStatusBool = false;
  
  checkCustomerEmail(email,function(checkStatus){ 
    checkStatusBool = checkStatus;
  });
   
  if(checkStatusBool){
    res.send({check: 'false'});  //already registered e-mail
  }
  else if (!!name && !!surname && !!email && !!password && name.length >= 3 && surname.length >= 3 && email.length >= 3 && email.includes('@') && password.length >= 6) {
   const randomValidationCode = randomHash.generateHash({length: 15});
   createCustomer(name, surname, email, randomValidationCode, password);
   sendValidationEmail(protocol + domain + "/emailValidation/" + randomValidationCode, email);
   res.send({check: 'true'});   //Successful SignUp
  } 
  else {
     res.send();                //Failed SignUp
  }
});

app.get('/emailValidation/:emailValidationCode', (req, res) => {

  const emailValidationCode = req.params.emailValidationCode;
  checkValidationEmail(emailValidationCode, function (statusValidationEmail) {
    if(statusValidationEmail)
      res.send({check: "true"});
    else
      res.send({check: "false"});
  });
});









app.post('/createStudents', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const studentsFile = req.body.studentsFile;
  const readFileType = req.body.readFileType;

  if (email == undefined, password == undefined, studentsData == undefined, readFileType == undefined)
    res.send({
      check: 'false'
    });

  checkCustomer(email, password, function (lastResult) { //Check customer
    if (lastResult == 'true') {
      getCustomer(email, password, function (result) { //Get CustomerId
        const customerId = result.id;
        createStudent(customerId, studentsFile, readFileType, function (createStudentsStatus) { //Create it to the database with the customer id and students excel data
          if (createStudentsStatus == 'true')
            res.send({
              check: 'true'
            });
          else if (createStudentsStatus == 'false')
            res.send({
              check: 'false'
            });
        });
      });

    } else if (lastResult == 'false') {
      res.send({
        check: 'false'
      });
    }
  });
});

app.post('/getStudents', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  checkCustomer(email, password, function (result) {
    if (result == true) {
      getCustomer(email, password, function (customerJSON) {
        const customerId = customerJSON.id;
        getStudents(customerId, function (studentsJSON) {
          res.send(studentsJSON);
        });
      });

    } else if (result == false) {
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
  const singleDesk = req.body.singleDesk;

  if (email == undefined, password == undefined, className == undefined, classArrangement == undefined, singleDesk == undefined)
    res.send({
      check: 'false'
    });

  checkCustomer(email, password, function (lastResult) { //Check customer
    if (lastResult == 'true') {
      getCustomer(email, password, function (customerJSON) { //Get CustomerId
        const customerId = customerJSON.id;
        createSchoolClass(customerId, className, classArrangement, singleDesk, function (createSchoolClassStatus) {
          if (createSchoolClassStatus == 'true')
            res.send({
              check: 'true'
            }); //Successful create school class
          else(createSchoolClassStatus == 'false')
          res.send({
            check: 'false'
          }); //Failed create school class
        });
      })
    } else if (lastResult == 'false') {
      res.send({
        check: 'false'
      });
    }
  });
});

app.post('/getSchoolClasses', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  checkCustomer(email, password, function (result) {
    if (result == true) {
      getCustomer(email, password, function (customerJSON) {
        const customerId = customerJSON.id;
        getSchoolClass(customerId, function (schoolClassesJSON) {
          res.send(schoolClassesJSON);
        });
      });
    } else if (result == false) {
      res.send({
        check: 'false'
      });
    }
  });
});








/* CheckCustomerID
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
*/










//    Student Functions
function createStudent(customerIdInfoExcel, fileExcelStudents, readFileType, callback) {
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
  readFromExcelStudents(customerIdInfoExcel, fileExcelStudents, readFileType, function (studentObj) {
    console.log(studentObj);
    mongoDb.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db("KelebekSistemi");

      db.collection("students").insertMany(studentObj, (error, data) => {
        client.close();
        if (err) throw err;
        console.log("1 student document inserted");
        if (err) return callback('false'); //For frontend negative warning
        else return callback('true'); //For frontend positive warning
      });
    });
  });
};

function readFromExcelStudents(customerIdInfoExcel, fileExcelStudents, readFileType, callback) { //using by createStudent()

  var studentsJSON = [{}]; //Basic JSON for students save
  var workbook = XLSX.read(fileExcelStudents, {
    type: readFileType
  }); //Get excel
  var sheet_name_list = workbook.SheetNames; //Get Sheet Names
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); //Convert to JSON
  var excelRowsObjArr = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet_name_list]); // Calculate for excel row count
  var excelRowCount = excelRowsObjArr.length; //Get Excel Row Count 
  var currentBranch = "T.C.\\nMANİSA VALİLİĞİ\\nTurgutlu / Turgutlu Lisesi Müdürlüğü\\nAL -  9. Sınıf / A Şubesi (ALANI YOK) Sınıf Listesi "; //Default Branch Value (9 / A)

  for (let count = 3; count < excelRowCount; count++) { //Loop for all students

    var tempBranch = xlData[count]["T.C.\nMANİSA VALİLİĞİ\nTurgutlu / Turgutlu Lisesi Müdürlüğü\nAL -  9. Sınıf / A Şubesi (ALANI YOK) Sınıf Listesi "]; //Get branch and grade but complex

    if (tempBranch != undefined && tempBranch.toString().includes('T.C.')) // if "T.C." is changing it changes the variable
      currentBranch = tempBranch;

    var branchAndGrade = currentBranch.split('- ')[1]; //Get branch and grade from complex string

    if (branchAndGrade != undefined) {
      var studentGrade = Number(branchAndGrade.split('.')[0].trim()); // Grade parse from complex string
      var studentBranch = branchAndGrade.split('/ ')[1].split(' ')[0].trim(); // Branch parse from complex string
    }

    var studentNumber = xlData[count].__EMPTY; //Get Student Number 
    var studentName = xlData[count].__EMPTY_2; //Get Student Name 
    var studentSurname = xlData[count].__EMPTY_6; //Get Student Surname 
    var studentGender = xlData[count].__EMPTY_10; //Get Student Gender

    if (studentName == undefined || studentName == "Adı") {
      continue;
    }

    studentsJSON[studentsJSON.length] = { // Students convert to JSON for database save
      customerId: customerIdInfoExcel,
      name: studentName,
      surname: studentSurname,
      number: studentNumber,
      grade: studentGrade,
      branch: studentBranch,
      gender: studentGender,
      createdTime: Date(Date.now)
    };
  };
  return callback(studentsJSON);
};

function getStudents(customerIdInfo, callback) {

  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("students").find({
      customerId: customerIdInfo
    }).sort({
      grade: 1,
      branch: 1,
      number: 1
    }).toArray(function (err, data) {
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
function createSchoolClass(customerIdInfo, classNameInfo, classArrangementInfo, singleDeskInfo, callback) {

  var schoolClassObj = {
    customerId: customerIdInfo, //String
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
      if (err) return callback('false');
      else {
        console.log("1 school class document inserted");
        return callback('true')
      };
    });
  });
};

function getSchoolClasses(customerIdInfo, callback) {

  mongoDb.connect(url, function (err, client) {
    const db = client.db("KelebekSistemi");
    db.collection("schoolClasses").find({
      customerId: customerIdInfo
    }).toArray(function (err, data) {
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