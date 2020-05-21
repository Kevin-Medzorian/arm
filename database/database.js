//Note: Vim by default doesn't highlight well multiline strings
//https://github.com/mapbox/node-sqlite3/wiki/API#databasegetsql-param--callback
//^ is api for node js sqlite
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./database/cme-data.db');
db.get("PRAGMA foreign_keys = ON")
console.log("[DB]\tInitialized sqlite3 Database");
//const failjson = {"login": false};
const util = require('util');

// Ensures that asynchronous db statements wait until their completion before proceeding
db.serialize(function () {
    module.exports.close = ()=>{
      db.close();
    }
/*    module.exports.date = function(year, month, day, hour, min){
      //YYYY-MM-DDTHH:MM
      //the T is a separator between day and hour
      return toString(year) + '-' +  month + '-' + day + 'T' + hour + ':' + min;
    }
    function print(str){
      console.log(`[DB] str`);
    }
*/
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
              console.log("[DB]" + err.message);
            }
            console.log("[DB]\tRow " + row.idx + ": " + row.email + "\t" + row.password);
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
      console.log("[DB]\tcreateTables");
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
      console.log("[DB]\tresetting. Careful...");
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

    module.exports.addcustomer = function(username, passwordhash, cid = null, res){
      console.log('[DB]addcustomer');
      function iferr(err){
        if(err){//most likely unique constraint failed
          console.log(`[DB]addcustomerERROR:username${username}, ${err}`);
          console.log({"login":false, "error":"Username already exists"});
          if(res) res.json({"login":false, "error":"Username already exists"});
          return;
        }
        db.get('select cid from Customer where username=? and passwordhash=?',
            [username,passwordhash],
            (err, row)=>{
              cidjson = {"login":true, "cid":row.cid};
              console.log(`[DB]addcustomer:${JSON.stringify(cidjson, null, 2)}`);
              if(res) res.json(cidjson);
        });
      }//iferr end

      if(cid){//custom cid
        db.run('INSERT INTO Customer VALUES (?,?,?)',
            [username, passwordhash, cid],iferr);
      } else{
        db.run('INSERT INTO Customer(username,passwordhash) VALUES (?,?)',
            [username, passwordhash],iferr);
      }
    }
    module.exports.addbusiness = function(username,passwordhash,name,bid = null, res){
      console.log('[DB]addbusiness');
      function iferr(err){
        if(err){
          console.log(`[DB]addbusinessERROR:username${username}, ${err}`);
          console.log({"login":false, "error":"Username or business name already exists"});
          if(res) res.json({"login":false, "error":"Username or business name already exists"});
          return;
        }
        console.log(`[DB]addbusiness ${username} success`);
        db.get('select bid from Business where username=? and passwordhash=?',
            [username, passwordhash],
            (err, row)=>{
              var bidjson = {"login":true, "bid":row.bid};
              console.log(`[DB]addbusiness:${JSON.stringify(bidjson, null, 2)}`);
              if(res) res.json(bidjson);
        });
      }//iferr end

      if(bid){//custom bid
        db.run('INSERT INTO Business VALUES (?,?,?,?)',
            [username, passwordhash, bid, name], iferr);

      } else{
        db.run('INSERT INTO Business(username,passwordhash,name) VALUES (?,?,?)',
            [username, passwordhash, name], iferr);
      }
    }
    module.exports.addstore = (busername,bpasswordhash,
      susername,spasswordhash,street,city,state,zipcode,res) =>{

      db.get('select bid from Business where username=? AND passwordhash=?',
          [busername,bpasswordhash],
          (err, row) =>{
            if(err){
              console.log(`[DB]addstoreERROR: business username:${busername},${err}`);
              console.log({"login":false, "error":"Internal error"});
              if(res) res.json({"login":false, "error":"Internal error"});
              return;
            }
            if(!row){
              console.log(`[DB]addstore business username(${busername}) combo does not exist`);
              console.log({"login":false, "error":"bad business credentials"});
              if(res) res.json({"login":false, "error":"Internal error"});
              return;
            }
            db.run('INSERT INTO Store(\
                  username, passwordhash, bid,\
                  street, city, state, zipcode) VALUES (?,?,?,?,?,?,?)',
                [susername,spasswordhash,row.bid,street,city,state,zipcode],
                (err) =>{
                  if(err){
                    console.log("[DB]addstore error: " + err);
                    console.log({"login":false, "error":"Username already exists"});
                    if(res) res.json({"login":false, "error":"Username already exists"});
                    return;
                  }

                  db.get('select sid from Store where username=? AND passwordhash=?',
                      [susername, spasswordhash],
                      (err, rowstore)=>{
                        var storejson = {"login":true, "sid":rowstore.sid};
                        console.log(`[DB]addstore:${storejson}`);
                        if(res) res.json(storejson);
                  });
            });
      });
    }

    //replaced by getallreceipts
    module.exports.getcid = (username, passwordhash, res) =>{
      console.log(`getcid: ${username},${passwordhash}`);
      db.get('select cid from Customer where username = ? AND passwordhash = ?',
          [username, passwordhash],
          (err, row) =>{
            if(err){
              console.log(`[DB]getcidERROR:username(${username}), ${err}`);
              console.log({"login":false, "error":"Internal error"});
              if(res) res.json({"login":false, "error":"Internal error"});
              return;
            }
            if(!row){
              console.log(`[DB]getcid ${username} not found`);
              console.log({"login":false, "error":"bad customer login"});
              if(res) res.json({"login":false, "error":"login failed"});
              return;
            }
            console.log("getcid"+JSON.stringify({"login":true, "cid":row.cid},null,2));
            if(res) res.json({"login":true, "cid":row.cid});
          }
      );
    }
    //replaced with getstores
    module.exports.getbid = (username, passwordhash, res) =>{
      db.get('select bid from Business where username = ? AND passwordhash = ?',
          [username, passwordhash],
          (err, row) =>{
            if(err){
              console.log(`[DB]getbidERROR: username(${username}), ${err}`);
              console.log({"login":false, "error":"Internal error"});
              if(res) res.json({"login":false, "error":"Internal error"});
              return;
            }
            if(!row){
              console.log(`[DB]getbid ${username} not found`);
              console.log({"login":false, "error":"bad business login"});
              if(res) res.json({"login":false, "error":"login failed"});
              return;
            }
            console.log(JSON.stringify({"login":true, "bid":row.bid},null,2));
            if(res) res.json({"login":true, "bid":row.bid});
          }
      );
    }
    //still in use
    module.exports.getsid = (username, passwordhash, res)=>{
      db.get('select sid from Store where username = ? AND passwordhash = ?',
          [username, passwordhash],
          (err, row) =>{
            if(err){
              console.log(`[DB]getsidERROR: username(${username}), ${err}`);
              console.log({"login":false, "error":"Internal error"});
              if(res) res.json({"login":false, "error":"Internal error"});
              return;
            }
            if(!row){
              console.log(`[DB]getsid ${username} not found`);
              console.log({"login":false, "error":"bad store login"});
              if(res) res.json({"login":false, "error":"login failed"});
              return;
            }
            console.log({"login":true, "sid":row.sid});
            if(res) res.json({"login":true, "sid":row.sid});
          }
      );
    }
    module.exports.getstores = (busername,bpasswordhash,res) =>{
      db.get('select bid,name from Business where username=? AND passwordhash=?',
          [busername,bpasswordhash],
          (err,row)=>{
          if(err){
            console.log(`[DB]getstoresERROR: username(${busername}), ${err}`);
            console.log({"login":false, "error":"Internal error"});
            if(res) res.json({"login":false, "error":"Internal error"});
            return;
          }
          if(!row){
            console.log(`[DB]getstoresERROR: username(${busername}) not found`);
            console.log({"login":false, "error":"login failed"});
            if(res) res.json({"login":false, "error":"login failed"});
            return;
          }
          var storejson = {
            "login":true,
            "name":row.name,
            "bid":row.bid,
            "stores":[]
          };
          db.each('select sid from Store where bid=?',
              [row.bid],
              (err, rowstore)=>{
                storejson["stores"].push(rowstore.sid);
              },
              (err,storecount)=>{
                console.log(`[DB]getstores: username(${busername}): json:${storejson}`);
                if(res) res.json(storejson);
          });

      });

    }
    //given username of customer
    module.exports.getallreceipts = (username, passwordhash, res) =>{
      var receiptjson = {}
      db.get('select cid from Customer C where username = ? and passwordhash = ?',
        [username, passwordhash],
        (err, rowin) => {
          if(err){
            console.log(`[DB]getallreceiptsERROR:username(${username}), ${err}`);
            console.log({"login":false, "error":"Internal error"});
            if(res) res.json({"login":false, "error":"Internal error"});
            return;
          }
          if(!rowin){
            console.log(`[DB]getallreceipts:${username} not found`);
            console.log({"login":false, "error":"login failed"});
            if(res) res.json({"login":false, "error":"login failed"});
            return;
          }
          receiptjson["login"] = true;
          receiptjson["cid"] = rowin.cid;
          receiptjson["receipts"] = [];
          //receiptjson["receipts"] = {};
          console.log(`[DB]cid: ${rowin.cid}`);

          promises = []
          //get receipts
          db.each('select\
            R.rid, S.sid, B.name, R.date, R.tax, R.subtotal, R.other\
            from Receipt R, Store S, Business B\
            where R.cid = ? AND R.sid = S.sid AND S.bid = B.bid',
            [rowin.cid],
            (err, rowrec) => {
              if(err){
                console.log(`[DB]getallreceipts-recERROR:${rowin.cid}`);
              }
              if(!rowrec){
                console.log(`[DB]getallreceipts-rec:no receipts`);
              }
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

            }, (err, numreceipt) =>{
              Promise.all(promises)
                .then(responses =>{
                    console.log(`PromiseDone:${responses}`);
                    console.log(JSON.stringify(receiptjson, null, 2));
                    if(res) res.json(receiptjson);
                });//print out receipt login
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
              //console.log(`[DB]${rid}:${receipt["item"]}`);
              if(rowcountitem)
                resolve(`${rid}:${rowcountitem}`);
              else
                resolve(`${rid}:none`);
            }
        );//item db.each end
      }));
    }

    //TODO
    module.exports.getbusinesstorereceipt =
      (busername,bpasswordhash,sid,res=null)=>{

        db.get('select 1 from Business B, Store S\
            where username=? and passwordhash=? and ',
            [business, bpasswordhash],
            (err, row)=>{
              if(err){
                console.log(`[DB]getbusinessstorereceiptERROR: username(${busername}), sid(${sid}), ${err}`);
                console.log({"login":false, "error":"Internal error"});
                res.json({"login":false, "error":"Internal error"});
                return;
              }
              if(!row){
                console.log(`[DB]`);
              }
              
        });
      

    }

    module.exports.getstorereceipt = (susername,spasswordhash,res=null)=>{
      db.get('select sid from Store where username=? and passwordhash=?',
          [susername, spasswordhash],
          (err, rowsid)=>{
            if(err){
              console.log(`[DB]getstorereceiptERROR: username(${susername}), ${err}`);
              console.log({"login":false, "error":"Internal error"});
              res.json({"login":false, "error":"Internal error"});
              return;
            }
            if(!row){
              console.log(`[DB]getstorereceipt: username(${susername}) not found`);
              console.log({"login":false, "error":"login failed"});
              res.json({"login":false, "error":"login failed"});
              return;
            }

            var storejson={
              "login":true,
              "receipts":[]
            }
            db.each('select rid,cid,date,tax,subtotal,other from Record where sid=?',
                [rowsid.sid],
                (err, rowrec)=>{
                  storejson["receipts"].push({
                    "rid":rowrec.rid,
                    "cid":rowrec.cid,
                    "date":rowrec.date,
                    "tax":rowrec.tax,
                    "subtotal":rowrec.subtotal,
                    "other":rowrec.other
                  });
            },(err, count)=>{
              console.log(`[DB]getstorereceipt: username(${username})`);
              console.log(storejson);
              res.json(storejson);
            });
      });
    }

    module.exports.storeaddreceipt =
      (susername,spasswordhash,cid,date,tax,subtotal,other,items,res)=>{
      //get sid, add receipt, get rid, add items
      console.log('[DB]storeaddreceipt');
      db.get('select sid from Store where username=? AND passwordhash=?',
          [susername, spasswordhash],
          (err, rowsid) =>{
            if(err){
              console.log(`[DB]storeaddreceiptERROR: username(${susername}) ${err}`);
              console.log({"login":false, "error":"Internal error"});
              if(res) res.json({"login":false, "error":"Internal error"});
              return;
            }
            if(!rowsid){
              console.log(`[DB]storeaddreceiptERROR: username(${username}) not found`);
              console.log({"login":false, "error":"Bad store credentials"});
              if(res) res.json({"login":false, "error":"Internal error"});
              return;
            }

            db.run('INSERT INTO Receipt(cid,sid,date,tax,subtotal,other) VALUES (?,?,?,?,?,?);',
                [cid,rowsid.sid,date,tax,subtotal,other],
                (err)=>{
                  if(err){
                    console.log(`[DB]storeaddreceiptERROR: username${susername}, ${err}`);
                    console.log({"login":false, "error":"Internal error"});
                    res.json({"login":false, "error":"Internal error"});
                    return;
                  }

                  var promises = []
                  items.forEach(val =>{
                      promises.push(new Promise((resolve, reject)=>{
                        db.run('insert into Item(?,?,?,?)',
                            [this.lastID,val.name,val.quantity,val.unitcost],
                            (err) =>{
                              if(err){
                                console.log(`storeaddreceiptERRORitem: username(${susername}), rid(${rowid.rid}), ${err}`);
                                reject(val.name);
                                return;
                              }
                              resolve();
                        });//db.run done
                      }));
                  });//forEach done
                  Promise.all(promises)
                  .then(response=>{
                      var pass = true;
                      response.forEach(val=>{
                        if(val)
                          pass = false;
                      });
                      if(pass){
                        res.json({"login":true});
                      } else{//some errror occurred for item
                        console.log({"login":false, "error":"Internal error item issue"});
                        res.json({"login":false, "error":"Internal error item issue"});
                      }
                  });//Promise done

            });//Receipt done

      });
    }

    module.exports.customeraddreceipt = (username, passwordhash, date, tax, subtotal, other, items, res)=>{
      db.get('select cid from Customer where username=? and passwordhash=?',
          [username, passwordhash],
          (err, row)=>{
            if(err){
              console.log(`[DB]customeraddreceiptERROR: username(${username}), ${err}`);
              console.log({"login":false, "error":"Internal error"});
              res.json({"login":false, "error":"Internal error"});
              return;
            }
            if(!row){
              console.log(`[DB]customeraddreceiptERROR: username(${username}) not found`);
              console.log({"login":false, "error":"login failed"});
              res.json({"login":false, "error":"login failed"});
              return;
            }

            db.run('insert into Receipt(cid,date,tax,subtotal,other) values(?,?,?,?,?)',
                [row.cid, date, tax, subtotal, other],
                (err)=>{
                  if(err){
                    console.log(`[DB]customeraddreceipt-recERROR: username(${username}), ${err}`);
                    console.log({"login":false, "error":"Internal error"});
                    res.json({"login":false, "error":"Internal error"});
                    return;
                  }
                  //this.lastID is the last rowid


                  var promises = []
                  items.forEach(val=>{
                    promises.push(new Promise((resolve, reject)=>{
                      db.run('insert into Item values(?,?,?,?)',
                          [this.lastID, val.name, val.quantity, val.unitcost],
                          (err)=>{

                          console.log(`[DB]customeraddreceipt-ItemERROR: username(${username}), rid(${this.lastID}), ${err}`);
                      });//item done

                    }));
                  });//items done

                  Promise.all(promises)
                  .then(response=>{
                      var pass = true;
                      response.forEach(val=>{
                        if(val)
                          pass = false;
                      });
                      if(pass){
                        res.json({"login":true});
                      } else{//some errror occurred for item
                        res.json({"login":false, "error":"Internal error item issue"});
                      }
                  });//Promise done
            });//Receipt done

      });//login done
    }

/*
    module.exports.getallusers = (res) =>{
      cidjson = {
        "login" : true,
        cid : []
      };
      db.all('select cid from Customer', [],
          (err, rows, res) => {
            console.log('[DB]getallusers:' + JSON.stringify(rows));
            //uidjson.uid

          });
    }
    module.exports.printbid = function(){
      console.log('[DB]printbid');
      console.log('username\tpasswordhash\tbid');
      db.each('select * from Business', [], function(err, row){
        console.log(`${row.username}\t${row.passwordhash}\t${row.bid}`);
      });
    }
*/




    module.exports.test = () =>{
      /*
      db.get('insert into abc(b) values (1); select last_insert_rowid();',
          (err, rows) =>{
            console.log(`TESTING TESTING rows:${rows}`);
            util.inspect(rows);
          }
      );*/
      /*
      db.serialize(() => {
        dbSum(1, 1, db);
        dbSum(2, 2, db);
        dbSum(3, 3, db);
        dbSum(4, 4, db);
        dbSum(5, 5, db);
      });

      // close the database connection
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
      });

      function dbSum(a, b, db) {
        db.get('SELECT (? + ?) sum', [a, b], (err, row) => {
          if (err) {
            console.error(err.message);
          }
          console.log(`The sum of ${a} and ${b} is ${row.sum}`);
        });
      }
      */
      return;

      //only does 1 command at a time and ignores the one after
      /*db.run('insert into Item values(1,"test",9,9);\
          insert into Item values(1,"test2",9,9);');
          */
    }




/*
    //this doesn't work
    function customerlogin(username, passwordhash, type){
        var user; 
        var id;
        if(type == 'c'){
          user = 'Customer';
          id = 'cid';
        } else if(type == 'b'){
          user = 'Business';
          id = 'bid';
        } else{//store
          user = 'Store';
          id = 'sid';
        }
        promises = []
        promises.push(new Promise((resolve, reject)=>{
          //-1 is err, 0 can't login, id number login successful

          db.get(`select ${id} from ${user} where username=? and passwordhash=?`,
            [username, passwordhash],
            (err, row)=>{

              if(err){
                console.log(`[DB]customerloginERROR: username(${username})`);
                console.log({"login":false, "error":"Internal error"});
                reject(-1);
                return;
              }
              if(!row){
                console.log(`[DB]customerlogin: username(${username}) not found`);
                reject(0);
                return;
              }
              resolve(row[id]);
          });
        }));
        Promise.all(promises)
          .then(response=>{
             //I guess something here? Maybe use timeout
          });
    }
*/


});
