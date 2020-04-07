var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./database/cme-data.db');

// Ensures that asynchronous db statements wait until their completion before proceeding
db.serialize(function () {
    // Create basic, generic table if it doesnt exist.
    db.run('CREATE TABLE IF NOT EXISTS users (email text, password text)');

    console.log("[DATABASE]\tInitialized sqlite3 Database");

    // Inserts a user into the 'users' table of our database
    function insertUser(email, password) {
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    }

    // Prints out the 'users' table of our database
    function printTable() {
        // This just prints all rows
        db.each('SELECT rowid AS id, email, password FROM users', function (err, row) {
            console.log("[DATABASE]\t" + row.id + ": " + row.email + "\t" + row.password);
        });
    }

    // Checks if the email and password combination exists in the 'users' table.
    function verifyUser(email, password) {
        // TODO
        //  db.each('SELECT rowid AS id, email, password FROM users', function (err, row) {
        //    console.log(row.id + ": "+ row.email + "\t" + row.password);
        //});
    }

    var email = "whatever@gmail.com";
    var password = "password123";
    insertUser(email, password);
    printTable();

});

