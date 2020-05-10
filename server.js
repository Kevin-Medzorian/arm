// [WEBSERVER FILE]

// Define custom package imports
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

// Database import from the database folder
const database = require('./database/database.js')

// Port we are running the server on. Can be any free port.
const port = 4000;

// Create the ExpressJS object
var app = express();

app.use(cors())
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


// Adds a customer to the database
app.get('/addcustomer', (req, res) => {
  const {username, password} = req.query;
  database.addCustomer(username, password, 7, res);
  database.printUsers();
});

// Gets the uid from a user
app.get('/getuid', (req, res) => {
  const {username, password} = req.query;
  database.getUID(username, password, res);
  database.printUsers();
});


app.listen(port, () => {
        console.log(`[WEBSERVER]\tServer active on port ${port}`);
});



// Rahul test cases here
//
/*var username = "sdcdc";
var password = "sdcscscsd";

// We will handle console.log
database.addUser(username, password)
console.log("Expected \"success\"  res");

//we should ensure we cannot have a null username -- not sure if this is a valid test case but 
//wanted to be sure
username = null
password = "a;kdflk"
database.addUser(username,password)
console.log("Expected failure res")

//adding customer to database
username = "Rahul"
password = "ARM3453"
database.addCustomer(username,password)

//get username -- here username will be Rahul
database.getUID(username,password)
console.log("Expected \"success\"  res");

//should fail -- no username found in database
username = "dflk39"
database.getUID(username,password)
console.log("Expected failure res")

//adding business
var businessName = "Target" 
password = "expect more pay less"
var type = "B"
database.addBusiness(businessName,password,type)
console.log("Expected \"success\"  res");

//adding store
var storeId = "Store110"
type = "S"
password = "daf;ksj"
address = "earth"
database.addStoreInBusiness(businessName,storeId,password,address,type)
console.log("Expected \"success\"  res");

//adding store name with same business name should fail
storeId = "Target"
address = "a;fdk"
database.addStoreInBusiness(businessName,storeId,password,address,type)
console.log("Expected \"failure\"  res")

//adding a store with another store with same address should fail
storeId = "aflkjs"
address = "earth"
database.addStoreInBusiness(businessName,storeId,password,address,type)
console.log("Expected \"failure\"  res")*/
