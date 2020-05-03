var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./database/cme-data.db');

// Ensures that asynchronous db statements wait until their completion before proceeding
db.serialize(function () {

  // Clears table
  db.run('drop TABLE if exists users;');

  // Creates table
  db.run("create table if not exists " +
    "users (username text, password text, uid text);");

  // Prints success
  console.log("[DATABASE]\tInitialized sqlite3 Database");

  // Adds a customer to the database
  module.exports.addCustomer = function(username, password, uid, res) {
    db.run('INSERT INTO users (username, password, uid) VALUES (?, ?, ?)',
      [username, password, uid],function(err, row){
        res.json({
          data: "success"
        });
      });
  }

  // Gets the UID for a particular user
  module.exports.getUID = function(username, password, res) {
    db.get("SELECT * FROM users where username=? and password=?",
      [username, password],function (err, row) {

        // Check empty
        if (row == undefined) {
          res.json({
            data: "failure"
          });

        // Else send data
        } else {
          res.json({
            data: row.uid
          });
        }
      });
  }

  module.exports.printUsers = function () {
    // This just prints all rows
    db.each('SELECT username, password, uid FROM users', function (err, row) {
      console.log("[DATABASE]\tRow " + row.username + ": " + row.password + "\t" + row.uid);
    });
  }
});
