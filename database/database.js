//Note: Vim by default doesn't highlight well multiline strings
//https://github.com/mapbox/node-sqlite3/wiki/API#databasegetsql-param--callback
//^ is api for node js sqlite
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./database/cme-data.db');
db.get("PRAGMA foreign_keys = ON")
console.log("[DATABASE]\tInitialized sqlite3 Database");
const blue = 'color:blue';
const failjson = JSON.stringify({"success": false});


// Ensures that asynchronous db statements wait until their completion before proceeding
db.serialize(function () {
    module.exports.close = function(){
      db.close();
    }
    module.exports.date = function(year, month, day, hour, min){
      //YYYY-MM-DDTHH:MM
      //the T is a separator between day and hour
      return toString(year) + '-' +  month + '-' + day + 'T' + hour + ':' + min;
    }

    /*
    // Create basic, generic table if it doesnt exist.
    db.run('CREATE TABLE IF NOT EXISTS users (email text, password text)');

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
        console.log('>printTable');
        db.each('SELECT rowid AS idx, email, password FROM users', function (err, row) {
            if(err){
              console.log("[DATABASE]" + err.message);
            }
            console.log("[DATABASE]\tRow " + row.idx + ": " + row.email + "\t" + row.password);
        });
        console.log('<printTable');
        //printcid();
    }*/

    /*
    // Checks if the email and password combination exist in the 'users' table.
    module.exports.verifyuser = function (email, password) {
        //  db.each('SELECT rowid AS id, email, password FROM users', function (err, row) {
        //    console.log(row.id + ": "+ row.email + "\t" + row.password);
        //});
    }*/

    //Creates tables
    module.exports.createtables = function(){
      console.log("[DATABASE]\tcreateTables");
      const addtable = 'CREATE TABLE IF NOT EXISTS ';

      db.run(addtable + 'Customer(\
            username TEXT UNIQUE NOT NULL,\
            passwordhash TEXT NOT NULL,\
            cid integer PRIMARY KEY check(typeof(cid) = "integer"))',
          function(err){
            console.log("createtables-Customer: ",err);
          });

      db.run(addtable + 'Business(\
            username TEXT UNIQUE NOT NULL,\
            passwordhash TEXT NOT NULL,\
            bid integer PRIMARY KEY check(typeof(bid) = "integer"),\
            name TEXT NOT NULL)',
          (err) =>{
            console.log("createtables-Business: ", err);
          });

      db.run(addtable + 'Store(\
            username TEXT UNIQUE NOT NULL,\
            passwordhash TEXT NOT NULL,\
            sid integer PRIMARY KEY check(typeof(sid) = "integer"),\
            bid integer,\
            street TEXT,\
            city TEXT,\
            state TEXT,\
            zipcode TEXT,\
            FOREIGN KEY(bid) REFERENCES Business(bid))',
          function(err){
            console.log("createtables-Store: ", err);
          });

      db.run(addtable + 'Receipt(\
            rid integer PRIMARY KEY,\
            cid integer,\
            sid integer,\
            date integer NOT NULL,\
            tax integer NOT NULL,\
            subtotal integer NOT NULL,\
            other TEXT,\
            FOREIGN KEY(cid) REFERENCES Customer(cid),\
            FOREIGN KEY(sid) REFERENCES Store(sid))',
          (err) => {
            console.log("createtables-Receipt: ", err);
          });

      db.run(addtable + 'Item(\
            rid integer,\
            name TEXT NOT NULL,\
            quantity integer NOT NULL check(typeof(quantity) = "integer"),\
            unitcost integer NOT NULL check(typeof(unitcost) = "integer"),\
            FOREIGN KEY(rid) REFERENCES Receipt(rid))',
          (err) =>{
            console.log("createtables-Item: ", err);
          });

/*old db, not used
      db.run(addtable + 'StoreName(\
            sid integer PRIMARY KEY,\
            sname TEXT NOT NULL,\
            bid NOT NULL,\
            FOREIGN KEY(bid) REFERENCES BID(bid))',
          [],
          (err) =>{
            console.log("createtables-StoreName: ", err);
          });

      db.run(addtable + 'StoreLocation(\
            sid TEXT,\
            location TEXT NOT NULL,\
            state VARCHAR(2) NOT NULL,\
            FOREIGN KEY(sid) REFERENCES StoreName(sid))',
          [],
          (err) => {
            console.log("createtables-StoreLocation: ", err);
          });
*/
      console.log('<createtables');
    }


    module.exports.resettables = function(){
      return;
      console.log("[DATABASE]\tresetting. Careful...");
      db.run('drop table Item');
      db.run('drop table Receipt');
      db.run('drop table Customer;');
      db.run('drop table Store;');
      db.run('drop table Business;');
    }
    /*
    module.exports.injection = function(){
      db.each('select * from Customer where cid = ?',
          ['4548 or 1=1'],
          (err, row) =>{
            if(err) console.log("injection1 " + err);
            if(row) console.log("injection2 " + rows);
          }, (err, count)=>{
            console.log(`injection rows: ${count}`);
          });
    }*/
/*
    module.exports.logincustomer = (username, passwordhash) =>{
      db.get('select cid from Customer where\
          username = ? AND passwordhash = ?',
          [username, passwordhash],
          (err, row, res) =>{
            if(row) console.log(JSON.stringify({"login" : true, "cid" : row.cid}));
            else console.log(JSON.stringify({"login" : false}));
          });
    }
*/
    module.exports.getallreceipts = (username, passwordhash, /*res*/) =>{
      var receiptjson = {}
      db.get('select cid from Customer C where username = ? and passwordhash = ?',
        [username, passwordhash],
        (err, rowin) => {
          if(err){
            //res.json(failjson);
            console.log(`[DATABASE]getallreceipts ${username} error1:${err}`);
          }
          if(!rowin) console.log(`[DATABASE]getallreceipts:${username}none`);
          receiptjson["login"] = true;
          receiptjson["cid"] = rowin.cid;
          receiptjson["receipts"] = [];
          //receiptjson["receipts"] = {};
          console.log(`[DATABASE]cid: ${rowin.cid}`);
          
          promises = []
          //get receipts
          db.each('select\
            R.rid, S.sid, B.name, R.date, R.tax, R.subtotal, R.other\
            from Receipt R, Store S, Business B\
            where R.cid = ? AND R.sid = S.sid AND S.bid = B.bid',
            [rowin.cid],
            (err, rowrec) => {
              if(err) console.log(`[DATABASE]getallreceipts-rec:${rowin.cid}`);
              if(!rowrec) console.log(`[DATABASE]getallreceipts-rec:no receipts`);
              receipt = {
                "rid" : rowrec.rid,
                "sid" : rowrec.sid,
                "name" : rowrec.name,
                "date" : rowrec.date,
                "tax" : rowrec.tax,
                "subtotal" : rowrec.subtotal,
                "other" : rowrec.other,
                "item" : []
              };
              receiptjson["receipts"].push(receipt);
              //receiptjson["receipts"][rid] = receipt;
              
              //enter items into receipt
              //promises pass by array, receipt pass by json?,
              getitem(promises, receipt, rowrec.rid);
              /*
              //promise to make sure items are all done before sending JSON
              promises.push(new Promise((resolve, reject) =>{
              //get items
              db.each('select\
                  name, quantity, unitcost\
                  from Item\
                  where rid = ?',
                  [rowrec.rid],
                  (err, rowitem) =>{

                    //in wrong array since receipt gets updated :/

                    console.log(`[DATABASE]itemname:${rowrec.rid},${rowitem.name}`);
                    item = {
                      "name" : rowitem.name,
                      "quantity" : rowitem.quantity,
                      "unitcost" : rowitem.unitcost
                    };
                    receipt["item"].push(item);
                    console.log(receipt["item"]);
                  }, (err, rowcountitem) =>{
                    console.log(`item done ${rowrec.rid}`);
                    if(rowcountitem)
                      resolve(`${rowin.rid}:found`);
                    else
                      resolve(`${rowin.rid}:none`);
                  }
              );//item db.each end
              }));//promise end
              */

            }, (err, numreceipt) =>{
              Promise.all(promises)
                .then(responses =>{
                    console.log(`PromiseDone:${responses}`);
                    console.log(JSON.stringify(receiptjson, null, 2));
                    //res.json(receiptjson);
                });//print out receipt status
            }
          );//receipt db.each end

        });//login done

      //return stuff;
    }
    //get all receipts for the other accounts

    let getitem = (promises, receipt, rid) =>{//preserves receipt reference
      promises.push(new Promise((resolve, reject) =>{
        
        db.each('select\
            name, quantity, unitcost\
            from Item\
            where rid = ?',
            [rid],
            (err, rowitem) =>{
              item = {
                "name" : rowitem.name,
                "quantity" : rowitem.quantity,
                "unitcost" : rowitem.unitcost
              };
              receipt["item"].push(item);
            }, (err, rowcountitem) =>{
              console.log(`[DATABASE]${rid}:${receipt["item"]}`);
              if(rowcountitem)
                resolve(`${rid}:${rowcountitem}`);
              else
                resolve(`${rid}:none`);
            }
        );//item db.each end
      }));
    }


    module.exports.getallusers = (res) =>{
      cidjson = {
        success : true,
        cid : []
      };
      db.all('select cid from Customer', [],
          (err, rows, res) => {
            console.log('[DATABASE]getallusers:' + JSON.stringify(rows));
            //uidjson.uid
            
          });
    }
/*
    module.exports.printbid = function(){
      console.log('%c[DATABASE]printbid', blue);
      console.log('username\tpasswordhash\tbid');
      db.each('select * from Business', [], function(err, row){
        console.log(`${row.username}\t${row.passwordhash}\t${row.bid}`);
      });
    }
*/
    //Add customer
    module.exports.addcustomer = function(username, passwordhash, cid = null){
      console.log('%c[DATABASE]addcustomer', blue);
      function iferr(err){
        if(err){
          console.log("[DATABASE]addbusiness error: " + err);
        }
      }
      if(cid){//custom cid
        db.run('INSERT INTO Customer VALUES (?,?,?)',
            [username, passwordhash, cid],iferr);
      } else{
        db.run('INSERT INTO Customer(username,passwordhash) VALUES (?,?)',
            [username, passwordhash],iferr);
      }
    }
    module.exports.addbusiness = function(username,passwordhash,name,bid = null){
      console.log('%c[DATABASE]addbusiness', blue);
      function iferr(err){
        if(err){
          console.log("[DATABASE]addbusiness error: " + err);
        }else{
          console.log(`[DATABASE]addbusiness ${username} success`);
        }
      }
      if(bid){//custom bid
        db.run('INSERT INTO Business VALUES (?,?,?,?)',
            [username, passwordhash, bid, name], iferr);

      } else{
        db.run('INSERT INTO Business(username,passwordhash,name) VALUES (?,?,?)',
            [username, passwordhash, name], iferr);
      }
    }
    module.exports.addstore = (busername,bpasswordhash,susername,spasswordhash,street,city,state,zipcode) =>{
      db.get('select bid from Business where username=? AND passwordhash=?',
          [busername,bpasswordhash],
          (err, row) =>{
            if(err){
              console.log(`[DATABASE]addstore error: business username:${busername},${err}`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            if(!row){
              console.log(`[DATABASE]addstore business username(${busername}) combo does not exist`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            db.run('INSERT INTO Store(\
                  username, passwordhash, bid,\
                  street, city, state, zipcode) VALUES (?,?,?,?,?,?,?)',
                [susername,spasswordhash,row.bid,street,city,state,zipcode],
                (err) =>{
                  if(err){
                    console.log("[DATABASE]addstore error: " + err);
                    console.log(failjson);
                    //res.json(failjson);
                    return;
                  }else{
                    console.log({"success":true});
                    //res.json({"success":true});
                  }
                }
            );
          }
      );
    }

    module.exports.getcid = (username, passwordhash) =>{
      console.log(`getcid: ${username},${passwordhash}`);
      db.get('select cid from Customer where username = ? AND passwordhash = ?',
          [username, passwordhash],
          (err, row) =>{
            if(err){
              console.log(`[DATABASE]getcid error: username(${username}) ${err}`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            if(!row){
              console.log(`[DATABASE]getcid ${username} not found`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            console.log("getcid"+JSON.stringify({"success":true, "cid":row.cid},null,2));
            //res.json({"success":true, "cid":row.cid});
          }
      );
    }
    module.exports.getbid = (username, passwordhash) =>{
      db.get('select bid from Business where username = ? AND passwordhash = ?',
          [username, passwordhash],
          (err, row) =>{
            if(err){
              console.log(`[DATABASE]getbid error: username(${username}) ${err}`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            if(!row){
              console.log(`[DATABASE]getbid ${username} not found`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            console.log(JSON.stringify({"success":true, "bid":row.bid},null,2));
            //res.json({"success":true, "bid":row.bid);
          }
      );
    }
    module.exports.getsid = (username, passwordhash)=>{
      db.get('select sid from Store where username = ? AND passwordhash = ?',
          [username, passwordhash],
          (err, row) =>{
            if(err){
              console.log(`[DATABASE]getsid error: username(${username}) ${err}`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            if(!row){
              console.log(`[DATABASE]getsid ${username} not found`);
              console.log(failjson);
              //res.json(failjson);
              return;
            }
            console.log({"success":true, "sid":row.sid});
            //res.json({"success":true, "sid":row.sid});
          }
      );
    }
    
/*
    module.exports.addreceipt = (username,passwordhash,cid,sid,date,tax,subtotal,other)=>{
      console.log('%c[DATABASE]addreceipt', blue);
      db.run('INSERT INTO Receipt(uid,sid,date,tax,subtotal) VALUES (?,?,?,?,?);\
          INSERT INTO Item(item,quantity,unitcost) VALUES (?,?,?)',
          [uid,sid,date,tax,subtotal, item,quantity,unitcost], function(err,row){
        if(err){
          console.log("[DATABASE]addreceipt error: " + err.message);
          return false;
        }
        return true;
      });
    }
*/
});

