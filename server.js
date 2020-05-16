// [WEBSERVER FILE]

// Define custom package imports
const express = require('express');
const bodyParser = require('body-parser')

// Database import from the database folder
const database = require('./database/database.js')

// Port we are running the server on. Can be any free port.
const port = 3000;
/*
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}*/

// Create the ExpressJS object
var app = express();

app.use(bodyParser.json()); // for parsing application/json requests

// Give everyone access to our static directory 'public'
app.use(express.static(__dirname + '/public'));

// Whenever a client connects (and thus calling a GET request) to 'localhost:4000/', we will route them to index.html.
app.get('/', function (req, res) {
        res.sendFile('./public/index.html');
});

// Handle POST request for login
// => req is the object for the requesting party (the client-side information)
// => res is the response object we are sending back to the client.
app.post('/login', function (req, res) {
        // req.body is now a loaded JSON structure, and **should** contain variables 'email' and 'password'
        // => We can verify whether this is the case later.... TODO

        console.log("[WEBSERVER]\tIP address (" + req.connection.remoteAddress +
                ") tried to login with email (" + req.body.email +
                ") and password (" + req.body.password + ").")

        // Generic success message sent back to the client (its enforced that we have to send a response)
        res.send("Generic success!");
});

app.listen(port, () => {
        console.log(`[WEBSERVER]\tServer active on port ${port}`);
});




// Adds a customer to the database
app.post('/customer-login', (req, res) => {
  database.getallreceipts(req.body.email, req.body.password, res);
});

// Adds a customer to the database
app.post('/store-login', (req, res) => {
  database.getsid(req.body.email, req.body.password, res);
});

// Adds a customer to the database
app.post('/customer-signup', (req, res) => {
  database.addcustomer(req.body.email, req.body.password, res);
});

// Adds a customer to the database
// Save for later
/*app.post('/store-signup', (req, res) => {
  database.addcustomer(req.body.email, req.body.password, res);
});
*/

app.post('/store-signup', (req, res) => {
  database.addcustomer(req.body.email, req.body.password, res);
});


/*
// Example use of the database:
//database.resettables();
console.log('start db stuff');
//database.printTable();

var reset = 0
if(reset == 1){
  database.resettables();
  database.createtables();
  return;
}
//database.adduser("user1", "code1", 1234);


database.getallreceipts("u3", "c3");
return;

//const util = require('util');
*/
//database.test();

var fs = require('fs');
//https://www.w3schools.com/nodejs/nodejs_filesystem.asp
//write my outputs to file
// Rahul test cases here
//
if(1==0){
  var username;
  var password;
  /*
  username = "sdcdc";
  password = "sdcscscsd";

  // We will handle console.log
  database.addUser(username, password)
  console.log("Expected \"success\"  res");

  //we should ensure we cannot have a null username -- not sure if this is a valid test case but
  //wanted to be sure
  username = null
  password = "a;kdflk"
  database.addUser(username,password)
  console.log("Expected failure res")
  */

  //adding customer to database
  var customerusername = "Rahul"
  var customerpassword = "ARM3453"
  database.addcustomer(customerusername,customerpassword)
  sleep(5000);
  //get username -- here username will be Rahul
  database.getcid(customerusername,customerpassword)
  console.log("Expected \"success\"  res");

  //should fail -- no username found in database
  username = "dflk39"
  database.getcid(username,password)
  console.log("Expected failure res")

  //adding business
  var businessName = "Target"
  var businesspassword = "expect more pay less"
  database.addbusiness(businessName,businesspassword, businessName)
  console.log("Expected \"success\"  res");
  sleep(5000);
  //adding store
  var storename = "Store110"
  //type = "S"
  var storepassword = "daf;ksj"
  var street = "mystreet"
  var city = "mycity"
  var state = "CA"
  var zipcode = "12345"
  database.addstore(businessName,businesspassword,storename,storepassword,street,
      city, state, zipcode)
  console.log("Expected \"success\"  res");

  sleep(5000);
  //adding store name with same business name should fail
  storeId = "Target"
  database.addstore(businessName,businesspassword,storename,storepassword,street,
      city, state, zipcode)
  console.log("Expected \"failure\"  res")
  /*
  //adding a store with another store with same address should fail
  storeId = "aflkjs"
  address = "earth"
  database.addstore(businessName,storeId,password,address,type)
  console.log("Expected \"failure\"  res")
  */
}
