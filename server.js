// [WEBSERVER FILE]
var corsOptions = {
  origin: 'https://receive-arm.pages.dev',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Define custom package imports
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
// Database import from the database folder
const database = require('./database/database.js');

// Port we are running the server on. Can be any free port.
const port = process.env.PORT || 5000
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// Create the ExpressJS object
var app = express();

app.use(bodyParser.json()); // for parsing application/json requests

// Give everyone access to our static directory 'public'
app.use(express.static(__dirname + '/public'));

// Whenever a client connects (and thus calling a GET request) to 'localhost:4000/', we will route them to index.html.
app.get('/', function (req, res) {
        res.sendFile('./public/index.html');
});

app.listen(port, () => {
        console.log(`[WEBSERVER]\tServer active on port ${port}`);
});


const errorempty = "Fields can't be empty";
const emptyerror = {"login":false, errorempty};
const badinput = {"login":false, "error": "bad input"};
//==================SIGN UP REQUESTS
// Adds a customer to the database
app.post('/customer-signup', cors(corsOptions), (req, res) => {
  console.log(`customer-signup`);
  try{
    if(req.body.email.length == 0 || req.body.password.length == 0){
      res.json(emptyerror);
      return;
    }
    database.addcustomer(req.body.email, req.body.password, null, res);
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
});
app.post('/business-signup', cors(corsOptions), (req, res) => {
  console.log('business-signup');
  try{
    if(req.body.email.length == 0 || req.body.password.length == 0 ||
        req.body.name.length == 0){
      res.json(emptyerror);
      return;
    }
    database.addbusiness(req.body.email, req.body.password, req.body.name, null, res);
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
});
app.post('/store-signup', cors(corsOptions), (req, res)=>{
  console.log('store-signup');
  const body = req.body;
  try{
    if(body.busername.length == 0 || body.bpassword.length == 0 ||
        body.susername.length == 0 || body.spassword.length == 0){
      res.json(emptyerror);
      return;
    }
    database.addstore(body.busername, body.bpassword, body.susername,
        body.spassword, body.street, body.city, body.state, body.zipcode, res);
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
});

//==================LOGIN REQUESTS
app.post('/customer-login', cors(corsOptions), (req, res) => {
  //json: {'email':'', 'password': ''}
  console.log(`/customer-login`);
  try{
    if(req.body.email.length == 0 || req.body.password.length == 0){
      res.json(emptyerror);
      return;
    }
    database.getallreceipts(req.body.email, req.body.password, res);
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
});
app.post('/business-login', cors(corsOptions), (req, res) => {
  console.log(`/business-login`);
  try{
    //json: {'email':'', 'password': ''}
    if(req.body.email.length == 0 || req.body.password.length == 0){
      res.json(emptyerror);
      return;
    }
    database.getstores(req.body.email, req.body.password, res);
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
});
app.post('/store-login', cors(corsOptions), (req, res) => {
  console.log(`/store-login`);
  try{
    //json: {'email':'', 'password': ''}
    if(req.body.email.length == 0 || req.body.password.length == 0){
      res.json(emptyerror);
      return;
    }
    //database.getsid(req.body.email, req.body.password, res);
    database.getstorereceipt(req.body.email, req.body.password, res);
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
});

//====================Add receipts
app.post('/store-add-receipt', cors(corsOptions), (req, res)=>{
  console.log('store-add-receipt');
  const body = req.body;
  try{
    if(body.email.length == 0 || body.password == 0){
      res.json({"login":false, "error": errorempty});
      return;
    }
    if(typeof(body.cid) != 'number' || body.cid <= 0 ||
        typeof(body.date) != 'number' ||
        typeof(body.tax) != 'number' || body.tax < 0 ||
        typeof(body.subtotal) != 'number' || body.subtotal < 0){

      res.json(badinput);
      return;
    }
    for(item of body.items){
      if( typeof(item.unitcost) != 'number' ||
          typeof(item.quantity) != 'number' || item.quantity <= 0){

        res.json(badinput);
        return;
      }
    }

    database.storeaddreceipt(
        body.email,
        body.password,
        body.cid,
        body.date,
        body.tax,
        body.subtotal,
        body.other,
        body.items,
        res
        );
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
  console.log(body);
});
app.post('/customer-add-receipt', cors(corsOptions), (req, res)=>{
  console.log('customer-add-receipt');
  const body=req.body;

  try{
    if(body.email.length == 0 || body.password.length == 0){
      res.json({"login":false, "error":errorempty});
      return;
    }
    if(typeof(body.date) != 'number' || body.date <= 0 ||
        typeof(body.tax) != 'number' || body.tax < 0 ||
        typeof(body.subtotal) != 'number' || body.subtotal < 0){
      res.json(badinput);
      return;
    }
    database.customeraddreceipt(
      body.email,
      body.password,
      body.date,
      body.tax,
      body.subtotal,
      body.other,
      body.items,
      res
    );
  } catch(err){
    console.log(err);
    res.json(badinput);
  }
});


//=====================Get individual receipts
app.post('/business-get-item', cors(corsOptions), (req, res)=>{
    try{
      if(req.body.email.length == 0 || req.body.password == 0 ||
          !req.body.rid){
        res.json({"login":false, "error":errorempty});
        return;
      }
      if(typeof(req.body.rid) != 'number'){
        res.json(badinput);
        return;
      }
      database.getbusinessitem(req.body.email, req.body.password, req.body.rid,
          res);

    } catch(err){
      console.log(err);
      res.json(badinput);
    }


});
app.post('/store-get-item', cors(corsOptions), (req, res)=>{
    try{
      if(req.body.email.length == 0 || req.body.password == 0 ||
          !req.body.rid){
        res.json({"login":false, "error":errorempty});
        return;
      }
      if(typeof(req.body.rid) != 'number'){
        res.json(badinput);
        return;
      }
      database.getstoreitem(req.body.email, req.body.password, req.body.rid,
          res);

    } catch(err){
      console.log(err);
      res.json(badinput);
    }

});

//maybe get names starting with ____
//then get stats on item with that name

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

//var fs = require('fs');
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
  var customerusername = "Rahul";
  var customerpassword = "ARM3453";
  database.addcustomer(customerusername,customerpassword);
  sleep(5000);
  //get username -- here username will be Rahul
  database.getcid(customerusername,customerpassword);
  console.log("Expected \"success\"  res");

  //should fail -- no username found in database
  username = "dflk39";
  database.getcid(username,password);
  console.log("Expected failure res");

  //adding business
  var businessName = "Target";
  var businesspassword = "expect more pay less";
  database.addbusiness(businessName,businesspassword, businessName);
  console.log("Expected \"success\"  res");
  sleep(5000);
  //adding store
  var storename = "Lootable";
  //type = "S"
  var storepassword = "lootMe";
  var street = "riotStreet";
  var city = "Minneapolis";
  var state = "MN";
  var zipcode = "12345";
  database.addstore(businessName,businesspassword,storename,storepassword,street,
      city, state, zipcode);
  console.log("Expected \"success\"  res");

  sleep(5000);
  //adding store name with same business name should fail
  database.addstore(businessName,businesspassword,storename,storepassword,street,
      city, state, zipcode);
  console.log("Expected \"failure\"  res");
  /*
  //adding a store with another store with same address should fail
  storeId = "aflkjs"
  address = "earth"
  database.addstore(businessName,storeId,password,address,type)
  console.log("Expected \"failure\"  res")
  */
}

// database.storeaddreceipt('test_store', 'test_password', 10000000, -1, 111, 222, null,
//     [
//     { name: 'a', unitcost: 1, quantity: 1 },
//     { name: 'a', unitcost: 1, quantity: 1 },
//     { name: 'a', unitcost: 1, quantity: 1 },
//     { name: 'a', unitcost: 1, quantity: 1 },
//     { name: 'a', unitcost: 1, quantity: 1 },
//     { name: 'a', unitcost: 1, quantity: 1 },
//     { name: 'a', unitcost: 1, quantity: 1 }
//     ],
//     null);

// database.test(10000003, 10000000, -1, 111, 222, null,
//       [
//       { name: 'q', unitcost: 1, quantity: 1 },
//       { name: 'q', unitcost: 1, quantity: 1 },
//       { name: 'q', unitcost: 1, quantity: 1 },
//       { name: 'q', unitcost: 1, quantity: 1 },
//       { name: 'q', unitcost: 1, quantity: 1 },
//       { name: 'q', unitcost: 1, quantity: 1 },
//       { name: 'q', unitcost: 1, quantity: 1 }
//       ],
//       null);
//susername,spasswordhash,cid,date,tax,subtotal,other,items,res