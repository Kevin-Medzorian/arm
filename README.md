# ARM - Receive Reciept Manager
This is a repository for a Spring 2020 CSE110 project.

# Setting up the project:
## Step 1: Install Node.js: 
If you want a Node.js installer, go [here.](https://nodejs.org/en/download/) Otherwise,

Ubuntu: `$ sudo apt-get install -y nodejs`

MacOS: `$ brew install node`

Windows: `$ cinst nodejs.install`

## Step 2: Clone the Repository.
```
$ git clone https://github.com/Kevin-Medzorian/arm.git
```

## Step 3: Install the dependencies.
Ubuntu/Mac:
```
$ cd path/to/arm/folder
$ npm install
```
This will install all the dependencies listed in package.json (including express, sqlite3, etc...)

# Running the server:
To start the webserver, run ` npm start ` or ` node server.js ` in the 'arm' directory.

# Viewing the website:
Once started, the website can be viewed at [localhost:3000](http://localhost:3000/) or [127.0.0.1:3000](http://127.0.0.1:3000/)

# Getting started with development:
Make sure to develop on the `develop` branch.

VSCode can also be helpful for organized development.

[Express.js basics](https://expressjs.com/en/starter/installing.html)

[Sqlite3 and Node.js API](https://github.com/mapbox/node-sqlite3/wiki/API#databasegetsql-param--callback)

[Sqlite3 and Node.js tutorial](https://www.sqlitetutorial.net/sqlite-nodejs/)

