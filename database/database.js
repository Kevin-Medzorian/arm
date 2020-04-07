var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./database/cme-data.db');

// Ensures that asynchronous db statements wait until their completion before proceeding
db.serialize(function () {
    // Create basic, generic table if it doesnt exist.
    db.run('CREATE TABLE IF NOT EXISTS users (email text, password text)');
    console.log("[DATABASE]\tInitialized sqlite3 Database");


    // NOTE: The syntax:
    //      'module.exports.********* = function() {}'
    // Is to allow external JS files to use this function.

    // Inserts a user into the 'users' table of our database
    module.exports.insertUser = function(email, password) {
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    }

    // Prints out the 'users' table of our database
    module.exports.printTable = function () {
        // This just prints all rows
        db.each('SELECT rowid AS id, email, password FROM users', function (err, row) {
            console.log("[DATABASE]\tRow " + row.id + ": " + row.email + "\t" + row.password);
        });
    }

    // Checks if the email and password combination exist in the 'users' table.
    module.exports.verifyUser = function (email, password) {
        // TODO
        //  db.each('SELECT rowid AS id, email, password FROM users', function (err, row) {
        //    console.log(row.id + ": "+ row.email + "\t" + row.password);
        //});
    }
});