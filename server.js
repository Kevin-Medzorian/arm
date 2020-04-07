// [WEBSERVER FILE]

// Define custom package imports
const express = require('express');
const bodyParser = require('body-parser')

// Database import from the database folder
const database = require('./database/database.js')

// Port we are running the server on. Can be any free port.
const port = 4000;

// Create the ExpressJS object
var app = express();

app.use(bodyParser.json()); // for parsing application/json requests

// Give everyone access to our static directory ./public
app.use(express.static(__dirname + '/public'));

// Handle POST request for login
// => req is the object for the requesting party (the client-side information)
// => res is the response object we are sending back to the client.
app.post('/login', function (req, res) {
        // req.body is now a loaded JSON structure, containing variables 'email' and 'password' 
        console.log("[WEBSERVER]\tIP address (" + req.connection.remoteAddress + 
                        ") tried to login with email (" + req.body.email +
                        ") and password ("+ req.body.password + ").")

        // Generic success message sent back to the client (its enforced that we have to send a response)
        res.send("Generic success!");
});

app.listen(port, () => {
        console.log(`[WEBSERVER]\tServer listening at ${port}`);
});