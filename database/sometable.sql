/*
insert into "tablename"(columns) values (values);
make sure:
  PRAGMA foreign_keys=ON;
*/
/*
CREATE TABLE Customer(
    username TEXT UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL,
    cid integer PRIMARY KEY check(typeof(cid) = "integer")
);
CREATE TABLE Receipt(
    rid integer PRIMARY KEY,
    cid integer,
    sid integer,
    date TEXT NOT NULL,
    tax integer NOT NULL,
    subtotal integer NOT NULL,
    other TEXT,
    FOREIGN KEY(cid) REFERENCES Customer(cid),
    FOREIGN KEY(sid) REFERENCES Store(sid)
);
CREATE TABLE Item(
    rid integer,
    name TEXT NOT NULL,
    quantity integer NOT NULL check(typeof(quantity) = "integer"),
    unitcost integer NOT NULL check(typeof(unitcost) = "integer"),
    FOREIGN KEY(rid) REFERENCES Receipt(rid)
);
CREATE TABLE Store(
    username TEXT UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL,
    sid integer PRIMARY KEY check(typeof(sid) = "integer"),
    bid integer,
    street TEXT,
    city TEXT,
    state TEXT,
    zipcode TEXT,
    FOREIGN KEY(bid) REFERENCES Business(bid)
);
CREATE TABLE Business(
    username TEXT UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL,
    bid integer PRIMARY KEY check(typeof(bid) = "integer"),
    name TEXT NOT NULL
);
*/

INSERT INTO "Business"(username,passwordhash,bid,name) VALUES('b1','p1',123, 'Ralph');
INSERT INTO "Business"(username,passwordhash,bid,name) VALUES('b2','p2',234, 'School');

INSERT INTO "Store"(username,passwordhash,sid,bid,street,city,state,zipcode) VALUES('s1','c1',123,123,'s','c','s','z');

INSERT INTO "Customer"(username,passwordhash,cid) VALUES('user1','code1',1234);
INSERT INTO "Customer"(username,passwordhash,cid) VALUES('u2','c2',2345);
INSERT INTO "Customer" VALUES('u3','c3',12345);

INSERT INTO "Receipt"(rid,cid,sid,date,tax,subtotal) VALUES(1,12345,123,'1',1,1);
INSERT INTO "Receipt"(rid,cid,sid,date,tax,subtotal) VALUES(2,12345,123,'2',3,4);

INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(1,'a',1,2);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(1,'a',2,3);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(2,'a',3,4);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(2,'a',3,5);

