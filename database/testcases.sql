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


INSERT INTO Business values('test_business', 'test_password', 10000000, 'MgRonalds');
INSERT INTO Store values('test_store', 'test_password', 10000000, 10000000, '123 Main St.', 'Mars', 'CA', '314159');

INSERT INTO Business values('test_business_2', 'test_password_2', 10000001, 'SterBucks');
INSERT INTO Store values('test_store2', 'test_password2', 10000001, 10000001, '234 Main St.', 'Pluto', 'CA', '173205');

Insert into Customer values('test_customer', 'test_password', 10000000);

Insert into Receipt values(100, 10000000, 10000000, cast(strftime('%s','2020-05-26 12:30:00') as integer), 0, 700, NULL);
Insert into Item values(100, 'apple', 2, 200);
Insert into Item values(100, 'pear', 3, 100);
Insert into Receipt values(101, 10000000, 10000000, cast(strftime('%s','2020-04-26 12:30:00') as integer), 100, 1000, NULL);
Insert into Item values(101, 'burger', 2, 200);
Insert into Item values(101, 'soda', 1, 600);


Insert into Receipt values(102, 10000000, 10000001, cast(strftime('%s','2020-05-22 12:30:00') as integer), 100, 1100, NULL);
Insert into Item values(102, 'book', 1, 800);
Insert into Item values(102, 'water', 3, 100);
Insert into Receipt values(103, 10000000, 10000001, cast(strftime('%s','2020-04-21 12:30:00') as integer), 0, 600, NULL);
Insert into Item values(103, 'coffee', 2, 200);
Insert into Item values(103, 'water', 1, 200);
Insert into Receipt values(104, 10000000, 10000001, cast(strftime('%s','2020-03-20 12:30:00') as integer), 100, 700, NULL);
Insert into Item values(104, 'coffee', 2, 200);
Insert into Item values(104, 'bagel', 1, 300);

