//Note: Vim by default doesn't highlight well multiline strings
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./database/cme-data.db');
const blue = 'color:blue';

// Ensures that asynchronous db statements wait until their completion before proceeding
db.serialize(function () {
    // Create basic, generic table if it doesnt exist.
    db.run('CREATE TABLE IF NOT EXISTS users (email text, password text)');
    console.log("[DATABASE]\tInitialized sqlite3 Database");
    module.exports.close = function(){
      db.close();
    }


    // NOTE: The syntax:
    //      'module.exports.********* = function() {}'
    // Is to allow external JS files to use this function.
    module.exports.date = function(year, month, day, hour, min){
      //YYYY-MM-DDTHH:MM
      //the T is a separator between day and hour
      return toString(year) + '-' +  month + '-' + day + 'T' + hour + ':' + min;
    }
        

    // Inserts a user into the 'users' table of our database
    module.exports.insertUser = function(email, password) {
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    }

    // Prints out the 'users' table of our database
    module.exports.printTable = function () {
        // This just prints all rows
        console.log('>printTable');
        db.each('SELECT rowid AS id, email, password FROM users', function (err, row) {
            if(err){
              console.log("[DATABASE]" + err.message);
            }
            console.log("[DATABASE]\tRow " + row.id + ": " + row.email + "\t" + row.password);
        });
        console.log('<printTable');
        //printcid();
    }

    /*
    // Checks if the email and password combination exist in the 'users' table.
    module.exports.verifyuser = function (email, password) {
        // TODO
        //  db.each('SELECT rowid AS id, email, password FROM users', function (err, row) {
        //    console.log(row.id + ": "+ row.email + "\t" + row.password);
        //});
    }*/

    //Creates tables
    module.exports.createtables = function(){
      console.log("[DATABASE]\tcreateTables");
      const addtable = 'CREATE TABLE IF NOT EXISTS ';

      db.run(addtable + 'Cid(\
            uid INT PRIMARY KEY,\
            hash INT NOT NULL)');

      //foreign key for the store id (sid)?
      db.run(addtable + 'Cid(\
            uid INT PRIMARY KEY,\
            hash INT NOT NULL,\
            sid INT NOT NULL)');

      db.run(addtable + 'Bid(\
            bid INT PRIMARY KEY,\
            hash INT NOT NULL)');
      console.log('hmm');

      db.run(addtable + 'ActionCurrent( rid INT PRIMARY KEY,\
            uid INT NOT NULL,\
            sid INT,\
            date TEXT NOT NULL,\
            tax INT NOT NULL,\
            subtotal INT NOT NULL,\
            FOREIGN KEY(uid) REFERENCES Cid(uid))');

      db.run(addtable + 'ReceiptCurrent(\
            rid INT NOT NULL,\
            item TEXT NOT NULL,\
            quantity INT NOT NULL,\
            unitcost INT NOT NULL,\
            FOREIGN KEY(rid) REFERENCES ActionCurrent(rid))');

      db.run(addtable + 'StoreName(\
            sid INT PRIMARY KEY,\
            sname TEXT NOT NULL,\
            bid NOT NULL,\
            FOREIGN KEY(bid) REFERENCES BID(bid))');

      db.run(addtable + 'StoreLocation(\
            sid TEXT,\
            location TEXT NOT NULL,\
            state VARCHAR(2) NOT NULL,\
            FOREIGN KEY(sid) REFERENCES StoreName(sid))');

      console.log('<createtables');
    }
    
    module.exports.printcid = function(){
      console.log('%c[DATABASE]printcid', blue);
      console.log('uid\thash\tsid');
      db.each('select * from Cid', [], function(){
        console.log(`${Cid.uid}\t${Cid.hash}\t${Cid.sid}`);
      });
    }


    //Add business
    module.exports.addbuser = function(username, hash){
      console.log('%c[DATABASE]addbuser', blue);
      /*db.each('SELECT count(bid) FROM Bid where bid = ?', [username], function(err, row){
        
      });*/
      db.run('INSERT INTO Bid (bid,hash) VALUES (?,?)', [username, hash]);
    }
    module.exports.checkbuser = function(username){//maybe db.get
      console.log('%c[DATABASE]checkbuser', blue);
      db.get('select count(bid) as c from bid where bid = ?',
          [username], function(err, row){
        if(err) console.log("[DATABASE]" + err.message);
        if(row.c == 1){
          console.log('[DATABASE] 1 result :D', 'color:green');
          return true;
        } else{
          return false;
        }
      });
    }

    //Add user
    module.exports.adduser = function(username, hash){
      console.log('%c[DATABASE]adduser', blue);
      /*db.each('SELECT count(uid) FROM Cid where uid = ?', [username], function(err, row){
        
      });*/
      db.run('INSERT INTO Cid (uid,hash) VALUES (?,?)', [username, hash],
          function(err, row){
        if(err){
          console.log("adduser error: " + err.message);
        }
          
      });
    }
    module.exports.checkuser = function(username){//maybe db.get
      console.log('%c[DATABASE]checkuser', blue);
      db.get('select count(uid) AS c from Cid where uid = ?',
          [username], function(err, row){
        if(err) console.log("[DATABASE]" + err.message);
        if(row.c == 1){
          console.log('[DATABASE] 1 result :D', 'color:green');
          return true;
        } else{
          return false;
        }
      });
    }
    
    module.exports.verifyuser = function(username, hash){//maybe db.get
      console.log('%c[DATABASE]verifyuser', blue);
      db.get('select count(uid) as c from Cid where uid = ? AND hash = ?',
          [username, hash], function(err, row){

        if(err) console.log("[DATABASE]" + err.message);
        if(row.c == 1){
          console.log('[DATABASE] 1 result :D', 'color:green');
          return true;
        } else if(row.c == 0){
          return false;
        } else{
          console.log("[DATABASE]verifyuser " + row.c + " found!?!?");
          return false;
        }
      });
    }

    module.exports.addreceipt = function(uid,sid,date,tax,subtotal, item,quantity,unitcost){
      console.log('%c[DATABASE]addreceipt', blue);
      if(date === 'now'){
        db.get('select strftime(\'%Y-%m-%dT%H:%M\', \'utc\') as t', [], (err, row)=>{
          date = row.t;
        });
      }
      db.run('INSERT INTO ActionCurrent(uid,sid,date,tax,subtotal) VALUES (?,?,?,?,?);\
          INSERT INTO ReceiptCurrent(item,quantity,unitcost) VALUES (?,?,?)',
          [uid,sid,date,tax,subtotal, item,quantity,unitcost], function(err,row){
        if(err){
          console.log("[DATABASE]addreceipt error: " + err.message);
          return false;
        }
        return true;
      });
    }


    module.exports.addstore = function(sname, loc, state){
      console.log('%c[DATABASE]addstore', blue);
      db.run('INSERT INTO StoreName(sname) VALUES (?);\
          INSERT INTO StoreLocation(location state) VALUES (?,?)',
          [sname, loc, state], function(err, row){


        if(err){
          console.log("[DATABASE]addstore error: " + err.message);
          return false;
        }
        return true;
      });
    }


    module.exports.countuser = function(){
      console.log('%c[DATABASE]countuser', blue);
      db.run('SELECT count(*) as c FROM Cid', [], function(err, row){
        if(err) console.log("[DATABASE]" + err.message);
        return row.c;
      });
    }

    module.exports.countreceipts = function(){
      console.log('%c[DATABASE]countreceipts', blue);
      db.run('SELECT count(*) as c from ReceiptCurrent', [], function(err, row){
        if(err) console.log("[DATABASE]" + err.message);
        return row.c;
      });
    }

});
