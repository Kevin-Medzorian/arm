/*Run this file with:
 sqlite3 cme-data.db < sometable.sql
*/

/*
insert into "Itemname"(columns) values (values);
*/
PRAGMA foreign_keys=ON;


drop table Item;
drop table Receipt;
drop table Customer;
drop table Store;
drop table Business;

CREATE TABLE Business(
    username TEXT UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL,
    bid integer PRIMARY KEY check(typeof(bid) = "integer"),
    name TEXT NOT NULL
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
CREATE TABLE Customer(
    username TEXT UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL,
    cid integer PRIMARY KEY check(typeof(cid) = "integer")
);
CREATE TABLE Receipt(
    rid integer PRIMARY KEY,
    cid integer,
    sid integer,
    date integer check(typeof(date) = 'integer'),
    tax integer check(typeof(date) = 'integer'),
    subtotal integer check(typeof(date) = 'integer'),
    other TEXT,
    FOREIGN KEY(cid) REFERENCES Customer(cid),
    FOREIGN KEY(sid) REFERENCES Store(sid)
);
CREATE TABLE Item(
    rid integer,
    name TEXT NOT NULL,
    quantity integer check(typeof(quantity) = "integer"),
    unitcost integer check(typeof(unitcost) = "integer"),
    FOREIGN KEY(rid) REFERENCES Receipt(rid)
);


INSERT INTO "Business"(username,passwordhash,bid,name) VALUES('b1','p1',123,'Ralph');
INSERT INTO "Business"(username,passwordhash,bid,name) VALUES('b2','p2',234,'School');
INSERT INTO "Business"(username,passwordhash,bid,name) VALUES('Target','expect more pay less',235,'Target');
INSERT INTO "Business"(username,passwordhash,bid,name) VALUES('target@gmail.com','target12',236,'Target12');

INSERT INTO "Store"(username,passwordhash,sid,bid,street,city,state,zipcode) VALUES('s1','c1',123,123,'s','c','s','z');
INSERT INTO "Store"(username,passwordhash,sid,bid,street,city,state,zipcode) VALUES('s2','c2',127,234,'a','b','c','z');

INSERT INTO "Customer"(username,passwordhash,cid) VALUES('user1','code1',1234);
INSERT INTO "Customer"(username,passwordhash,cid) VALUES('u2','c2',2345);
INSERT INTO "Customer" VALUES('u3','c3',12345);

INSERT INTO "Receipt"(rid,cid,sid,date,tax,subtotal,other) VALUES(1,12345,123,cast(strftime('%s','2020-05-26 12:30:00') as integer),1,1,NULL);
INSERT INTO "Receipt"(rid,cid,sid,date,tax,subtotal,other) VALUES(2,12345,123,cast(strftime('%s','2020-04-01 02:30:00') as integer),3,4,'otherstuff');
INSERT INTO "Receipt"(rid,cid,sid,date,tax,subtotal,other) VALUES(3,1234,127,cast(strftime('%s','2020-02-26 12:30:00') as integer),2,3,NULL);
INSERT INTO "Receipt"(rid,cid,sid,date,tax,subtotal,other) VALUES(4,1234,127,cast(strftime('%s','2020-01-26 12:30:00') as integer),2,3,'otherstuff2');

INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(1,'a',1,2);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(1,'a',2,3);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(1,'test',9,9);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(1,'test',9,9);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(2,'a',3,4);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(2,'a',3,5);

INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(3,'food',1,300);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(3,'food1',1,300);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(3,'food2',2,300);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(3,'food3',3,300);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(4,'meal1',1,1);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(4,'meal2',2,2);
INSERT INTO "Item"(rid,name,quantity,unitcost) VALUES(4,'meal3',3,3);

