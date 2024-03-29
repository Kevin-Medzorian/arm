const API_URL = "https://receive-kevinmedzor.b4a.run"; // Set this to URL of the WebAPI.
var loggedIn = false;
var receipts = null;
var UID = null;
var busername = null;
var bpassword = null;
var susername = null;
var spassword = null;
var stores = [];
var currentItems = [];
var itemsResult = "<table><th class=\"text-left\"> Name </th><th> Cost </th><th> Quantity </th>";
var subtotal = 0;
var total = 0;

/*used for charts: 'current' version doesn't work so using version 45*/
google.charts.load('45', {'packages':['corechart']});

/*
    Called whenever the customer "login!" button is clicked.
    Grabs the approriate HTML fields.
    Then, makes a POST request on "/customer-login" to the server to try to login.
*/
function customerLogin() {
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");
    // Grab the appropriate HTML field data
    const emailVal = $("#customer-email-login").val();
    const passwordVal = $("#customer-password-login").val();
    if(emailVal.length == 0 || passwordVal.length == 0){
        $(".error").html("Email and password should not be empty");
    } else{
        console.log("Sending POST request...");

        // POST request using fetch()  on "/customer-login"
        fetch(API_URL + "/customer-login", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify({
                email: emailVal,
                password: passwordVal
            }),
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        // Converting to JSON
        .then(response => response.json())
        // Displaying results to console
        .then(json => {

            // Check if the response's "login" field is true (SUCCESS).
            try{
                if(json.login){
                    loggedIn = true;
                    receipts = json.receipts;
                    UID = json.cid;
                    openCustomerSession();
                } else{
                    $(".error").html("Email or password is incorrect");
                }
            } catch(err) {
                alert(err); // If there is ANY error here, then send an alert to the browser.
            }
        })
        .catch((error) => { // If there is an error in our POST response (404 error, no server found, etc...), alert the browser.
            alert(error);
        });
    }

    event.preventDefault(); // Prevent page from reloading.
}
/*
    Called when the business clicks the add store
    Grabs apppropriate HTML fields
    Then, makes POST request on "/"
*/
function storeSignUp(){
    $(".store-error").html("");
    const streetVal = $("#store-street").val();
    const cityVal = $("#store-city").val();
    const stateVal = $("#store-state").val();
    const zipCodeVal = $("#store-zipcode").val();
    const managerEmailVal = $("#store-manager-email").val();
    const passwordVal = $("#store-password").val();
    const confirmVal = $("#store-confirm-password").val();
    //const confirmVal = $("#store-confirm-password").val();
    console.log(streetVal);
    console.log(cityVal);
    console.log(stateVal);
    console.log(zipCodeVal);
    console.log(passwordVal);
    if(streetVal.length === 0 || cityVal.length === 0 || stateVal.length === 0 || zipCodeVal.length === 0 ||
        managerEmailVal.length === 0 || passwordVal.length === 0){
        $(".store-error").html("Please fill all the necessary information");
        return;
    }
    console.log(passwordVal);
    if(passwordVal.length < 8){
        console.log("Hello");
        $(".store-error").html("Password must be at least 8 characters long");
        return;
    }
    if(!checkPasswordConditions(passwordVal,confirmVal)){
        $(".store-error").html("Password must match");
        return;
    }
   // console.log(confirmVal);
    console.log("Sending POST request...");

    fetch(API_URL + "/store-signup",{
        method: "POST",
        body: JSON.stringify({
            busername : busername,
            bpassword: bpassword,
            susername : managerEmailVal,
            spassword : passwordVal,
            street : streetVal,
            city : cityVal,
            state : stateVal,
            zipcode : zipCodeVal
        }),

        headers:{
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        try{
            console.log(json);
            if(json.login){
                console.log("store login true");
                //UID = json.sid;
                //openStoreSession();
                console.log(UID);
                stores.push({
                    sid : json.sid,
                    street : streetVal,
                    city : cityVal,
                    state : stateVal,
                    zipcode : zipCodeVal
                });
                displayStores();

            }else{
                //some error
                $(".store-error").html("Email already exists");
            }
        }catch(err) {
            alert(err); // If there is ANY error here, then send an alert to the browser.
        }
    });

    event.preventDefault();
}

/*
    Called when the business clicks the send receipt button
    Grabs apppropriate HTML fields
    Then, makes POST request on "/"
*/
function storeAddReceipt(){
    if(currentItems.length == 0){
        $(".store-receipt-error").html("Please add an item.");
        return;
    }

    //const total = $("#total").val();
    var tax = $("#tax").val();
    if(tax.length == 0){
        $(".store-receipt-error").html("Please enter a tax value.");
        return;
    }
    var taxInt = Math.round(100 * (total-subtotal));
    var subtotalInt = Math.round(100 * subtotal);
    if(subtotal <= 0){
        $(".store-receipt-error").html("Please enter items.");
        return;
    }

    const receiptDate = -1;  //todays date?

    console.log(subtotalInt/100);
    console.log(taxInt/100);
    var cid = $("#cid").val();
    console.log(cid);
    if(cid.length === 0){
        $(".store-receipt-error").html("Please enter a Customer ID");
        return;
    }

    if (isNaN(cid)) {
        $(".store-receipt-error").html("Invalid Customer ID");
        return;
    }
    var cidInt = parseInt($("#cid").val());

    if (cidInt < 10000000 || cidInt > 99999999) {
        $(".store-receipt-error").html("Invalid Customer ID");
        return;
    }
    console.log("Sending POST request...");
    //sid : UID, //get set to json.sid
    fetch(API_URL + "/store-add-receipt", {
            method: "POST",
            body: JSON.stringify({
            email : susername, //gets set to email val on login
            password : spassword, //gets set to password val on login
            cid : cidInt, // gets parsed as an Int
            date : receiptDate, //const int = -1
            tax : taxInt, // in cents
            subtotal : subtotalInt, // in cents
            other : null, //string
            items : currentItems //array of json

        }),

        headers:{
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        try{
            console.log(json);
            if(json.login){
                $(".store-receipt-error").html("");
                itemsResult = "<table><th class=\"text-left\"> Name </th><th> Cost </th><th> Quantity </th>";;
                $(".items-list").html(itemsResult);
                $(".store-receipt-error").html("");
                $(".store-receipt-complete").html("Receipt Sent.");
                subtotal = 0;
                total = 0;
                currentItems = [];
                $("#total-tax").html("Total Tax: ____");
                $("#subtotal").html("Subtotal: ____");
                $("#total-cost").html("Total Cost: ____");
            }else{//bad cid probably
                if(json.error == "bad cid"){
                    $(".store-receipt-error").html("Invalid Customer ID.");
                } else{
                    $(".store-receipt-error").html("Server returned error: " + json.error);
                }
            }
        }catch(err) {
            alert(err); // If there is ANY error here, then send an alert to the browser.
        }
    });

    event.preventDefault();
}
/*
    Called when the business clicks the add item button
    Grabs apppropriate HTML fields
    Then, adds to item array "/"
*/
function storeAddReceiptItem(){

    $(".store-receipt-complete").html("");
    console.log("adding item!");
    const itemName = $("#itemName").val();
    const itemCost = $("#itemCost").val();
    const itemQuantity = $("#itemQuantity").val();
    var tax = $("#tax").val();

    //currentItems.push(itemName);

    if(itemName.length === 0 || itemCost.length === 0 || itemQuantity.length === 0){
        $(".store-receipt-error").html("Please complete all fields.");
        return;
    }
    if(tax.length == 0){
        $(".store-receipt-error").html("Please enter the tax amount.");
        return;
    }

    var itemCostCurrent = parseFloat(itemCost);
    var itemQtyCurrent = parseFloat(itemQuantity);

    if(!(itemCostCurrent > 0)){
        $(".store-receipt-error").html("Invalid item cost.");
        return;
    }
    if(!Number.isInteger(itemQtyCurrent) || !(itemQtyCurrent > 0)){
        $(".store-receipt-error").html("Invalid item quantity.");
        return;
    }

    var taxF = parseFloat(tax);
    if(!(taxF >= 0)){
        $(".store-receipt-error").html("Invalid item tax.");
        return;
    }

    subtotal = (subtotal+(itemCostCurrent*itemQtyCurrent));
    total = (total+taxF+(itemCostCurrent*itemQtyCurrent));


    $("#total-tax").html("Total Tax: $"+ ((total-subtotal).toFixed(2)));
    $("#subtotal").html("Subtotal: $"+subtotal.toFixed(2));
    $("#total-cost").html("Total Cost: $"+total.toFixed(2));

    var completeItem = { name: itemName, unitcost: itemCostCurrent*100, quantity : itemQtyCurrent };

    //var itemString = JSON.stringify(completeItem);

    currentItems.push(completeItem);


    itemsResult += "<tr><td class=\"text-left\">" + itemName + "</td><td>$" + itemCostCurrent + "</td><td>" + itemQtyCurrent + "</td></tr>";

    //inject into html here
    $(".store-receipt-error").html("");

    $(".items-list").html(itemsResult);
}

function displayStores(){
    let result = `<table style="white-space:nowrap; background-color: rgba(42, 143, 201, 0.8); border-radius: 20px; max-width: 100%;">`;
    result += "<th> Store ID </th>";
    result += "<th> Street </th>";
    result += "<th> City </th>";
    result += "<th> State </th>";
    result += "<th> Zipcode </th>";
    let index = 1;
    console.log(stores);
    for(let store of stores){
        result += `<tr><td style="text-align:center;">` + store.sid + "</td><td>" + store.street + "</td><td>" +
          store.city + "</td><td>" + store.state + "</td><td>" + store.zipcode + "</td></tr>";
        index = index + 1;
    }
    /* result += "</table>";
     console.log("result");
     console.log(result);*/
     /*result += "<tr>\
     <th>Firstname</th>\
     <th>Lastname</th>\
     <th>Age</th>\
   </tr>\
   <tr>\
     <td>Jill</td>\
     <td>Smith</td>\
     <td>50</td>\
   </tr>\
   <tr>\
     <td>Eve</td>\
     <td>Jackson</td>\
     <td>94</td>\
   </tr>\
 </table>"*/
    $(".show-stores").html(result);
}

/*
    Called whenever the store "login!" button is clicked.
    Grabs the approriate HTML fields.
    Then, makes a POST request on "/store-login" to the server to try to login.
*/
function storeLogin() {
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");

    // Grabs appropriate HTML field data.
    const emailVal = $("#store-email-login").val();
    const passwordVal = $("#store-password-login").val();
    if(emailVal.length === 0 || passwordVal.length === 0){
        $(".error").html("Email and password should not be empty");
    } else{
        console.log("Sending POST request...");

        // POST request using fetch()  on "/store-login"
        fetch(API_URL + "/store-login", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify({
                email: emailVal,
                password: passwordVal
            }),
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        // Converting to JSON
        .then(response => response.json())
        // Displaying results to console
        .then(json => {
            console.log(json);
            try{
                if(json.login){
                    loggedIn = true;
                    UID = json.sid;
                    susername = emailVal;
                    spassword = passwordVal;
                    openStoreSession();
                } else{
                    $(".error").html("Email or password is incorrect");
                }
            } catch(err) {
                alert(err); // If there is ANY error here, then send an alert to the browser.
            }

        })
        .catch((error) => {
            alert(error);
        });
    }
    event.preventDefault(); // Prevent page from reloading.
}

/* FUTURE   => For when we implement BUSINESS accounts
    Called whenever the business "login!" button is clicked.
    Finally, makes a POST request on "/business-login" to the server to try to login.
*/
function businessLogin() {
    // TODO
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");
    const emailVal = $("#business-email-login").val();
    const passwordVal = $("#business-password-login").val();
    if(emailVal.length == 0 || passwordVal == 0){
        $(".error").html("Email and password should not be empty");
    }else{
        console.log(emailVal + passwordVal);
        busername = emailVal;
        bpassword = passwordVal;
        console.log("Sending POST request...");

        // POST request using fetch()
        fetch(API_URL + "/business-login", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify({
                email: emailVal,
                password: passwordVal
            }),
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        // Converting to JSON
        .then(response => response.json())
        // Displaying results to console
        .then(json => {
            console.log(json);
            try{
                if(json.login){
                    loggedIn = true;
                    receipts = json.receipts;
                    UID = json.bid;
                    stores = json.stores;
                    console.log(stores);
                    openBusinessSession();
                } else{
                    $(".error").html("Email or password is incorrect");
                }
            } catch(err) {
                alert(err); // If there is ANY error here, then send an alert to the browser.
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    event.preventDefault(); // Prevent page from reloading.
}

function checkPasswordConditions(passwordVal,confirmVal){
    if(passwordVal !== confirmVal){
        $(".error").html("Passwords do not match.");
        return false;
    }else if(passwordVal.length < 8){
        $(".error").html("Password must at least be 8 characters long");
        return false;
    }
    return true;
}
/*
    Called whenever the customer "signup!" button is clicked.
    Grabs the approriate HTML fields, ensures password == confirm-password.
    Finally, makes a POST request on "/customer-signup" to the server to try to signup.
*/
function customerSignup() {
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");

    // Grab appropriate values from HTML fields.
    const emailVal = $("#customer-email-signup").val();
    const passwordVal = $("#customer-password-signup").val();
    const confirmVal = $("#customer-password-confirm").val();
    if(emailVal.length === 0){
        $(".error").html("Email cannot be empty");
    }else if(checkPasswordConditions(passwordVal,confirmVal)){
        fetch(API_URL + "/customer-signup",{
            method: "POST",
            body: JSON.stringify({
                email : emailVal,
                password : passwordVal
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            //{"login":true, "cid":12355}
            console.log("trying json.login");
            try{
                console.log(json);
                if(json.login){
                    console.log("customer login true");
                    loggedIn = true;
                    UID = json.cid;
                    openCustomerSession();
                }else{
                    //some error
                    $(".error").html("Email already exists");
                }
            }catch(err) {
                alert(err); // If there is ANY error here, then send an alert to the browser.
            }
        });
    }

    event.preventDefault(); // Prevent page from reloading.
}

/*
    Called whenever the store "signup!" button is clicked.
    Grabs the approriate HTML fields, ensures password == confirm-password.
    Then, makes a POST request on "/store-signup" to the server to try to signup.
*/
function businessSignup() {
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");

    // Grab appropriate values from HTML fields.
    const nameVal = $("#business-name-signup").val();
    const emailVal = $("#business-email-signup").val();
    //const addressVal = $("#business-address-signup").val();
    const passwordVal = $("#business-password-signup").val();
    const confirmVal = $("#business-password-confirm").val();
    busername = emailVal;
    bpassword = passwordVal;
    console.log(nameVal+emailVal+passwordVal);
    // Ensure password == confirm-password before attempting to signup.
    if(nameVal.length === 0){
        $(".error").html("Name cannot be empty");
    }else if(emailVal.length == 0){
        $(".error").html("Email cannot be empty");
    }
    else if(checkPasswordConditions(passwordVal,confirmVal)){
        fetch(API_URL + "/business-signup",{
            method: "POST",
            body: JSON.stringify({
                name : nameVal,
                email : emailVal,
                password : passwordVal
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            //{"login":true, "cid":12355}
            //console.log("trying json.login");
            try{
                //console.log(json);
                if(json.login){
                    console.log("business login true");
                    loggedIn = true;
                    UID = json.bid;
                    openBusinessSession();
                }else{
                    //some error
                    $(".error").html("Email already exists");
                }
            }catch(err) {
                alert(err); // If there is ANY error here, then send an alert to the browser.
            }
        });
    }

    event.preventDefault(); // Prevent page from reloading.
}

/*
After a successfull login response, open the customer session by unhiding/hiding appropriate HTML div's
Adjusts navbar, then delegates setting up UID and Receipts pages to other functions.
*/
function openCustomerSession(){

    console.log("opencustomersession");
    $("#home").hide(); // Hide our home DIV (this is the one we see whenever we are not logged in).
    $("#customer-session").fadeIn(); // Show our customer-session DIV (customer page).
    adjustNavbar();

    new QRCode(document.getElementById("qrcode-image"), ""+UID);

    console.log("Opened customer session.");

    // Set up our UID-text to be equal to our UID
    $("#uid-text").html(UID);
    showAllReceipts();
    /*
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    var disp = [];
    var mons = [];
    var thisDate = new Date();
    var start = thisDate.getMonth();
    var i;
    for (i = 0; i < 5; i++) {
      disp.push({
        name: months[(start + months.length) % months.length],
        index: (start + months.length) % months.length,
        total: 0
      });
      mons.push(disp[i].index);
      start -= 1;
    }

    if(receipts){
        var j;
        for (i=0; i < receipts.length; i++) {
            var date = new Date(receipts[i].date*1000);

            // Check same year
            if (date.getYear() == thisDate.getYear()) {
                // Check months
                for (j=0; j < disp.length; j++) {
                    if (date.getMonth() == disp[j].index) {
                        disp[j].total += receipts[i].subtotal + receipts[i].tax;
                    }
                }
            }
        }
        for(j = 0; j < disp.length; j++){
            disp[j].total /= 100;
        }
    }


    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Dollars');
    data.addRows([
      [disp[4].name, disp[4].total],
      [disp[3].name, disp[3].total],
      [disp[2].name, disp[2].total],
      [disp[1].name, disp[1].total],
      [disp[0].name, disp[0].total]
    ]);

    // Set chart options
    var options = {'title':'Monthly Spending',
                   'width':400,
                   'height':300,
                    'backgroundColor': '#fafafa'};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div1'));
    chart.draw(data, options);
    */
    google.setOnLoadCallback(drawChart1);
    function drawChart1() {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


        var date = new Date();
        var thismonth = date.getMonth();
        var thisyear = date.getYear();

        var furthestdate = new Date();
        if (thismonth > 3) {
          furthestdate.setMonth(thismonth - 3);
        } else {
          furthestdate.setFullYear(furthestdate.getFullYear() - 1);
          furthestdate.setMonth(thismonth - 3 + 12);
        }
        furthestdate.setDate(0);
        furthestdate.setHours(0);
        furthestdate.setMinutes(0);
        furthestdate.setSeconds(0);
        furthestdate.setMilliseconds(0);

        var backsecond = Math.round(furthestdate.getTime() / 1000);
        //console.log(backsecond);


        var values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        receipts.forEach(val => {
          //val is a json
          var curdate;
          if (val.date >= backsecond) {
            curdate = new Date(val.date * 1000);
            if(curdate.getMonth() <= thismonth || (curdate.getFullYear() + 1 == thisyear)){
              values[curdate.getMonth()] += val.subtotal + val.tax;
            }
          }
        });

        var i;
        for (i = 0; i < 12; i++) {
          values[i] /= 100;
        }

        var rows = [];
        var ticks = []
        for (i = 4; i >= 0; i--) {
          rows.push([{
            v: 4 - i,
            f: months[(thismonth - i + 12) % 12]
          }, values[(thismonth - i + 12) % 12]]);
          //console.log(months[(thismonth - i + 12) % 12] + values[(thismonth - i + 12) % 12]);
          ticks.push({
            v: 4 - i,
            f: months[(thismonth - i + 12) % 12]
          });
        }


        var custdata1 = new google.visualization.DataTable();
        custdata1.addColumn('number', 'Month');
        custdata1.addColumn('number', 'Dollars');
        /*custdata1.addRows([
          [{
            v: 0,
            f: 'Jan'
          }, 1000],
          [{
            v: 1,
            f: 'Feb'
          }, 1170],
          [{
            v: 2,
            f: 'Mar'
          }, 660],
          [{
            v: 3,
            f: 'Apr'
          }, 1030]
        ]);*/
        custdata1.addRows(rows);

        var custoptions1 = {
          width: 600,
          heigh: 800,
          chartArea: {
            width: "70%",
            height: "70%"
          },
          curveType: 'function',
          title: 'Spending over the last 5 months',

          hAxis: {
            title: 'Month',
            titleTextStyle: {
              color: '#333'
            },
            baseline: -1,
            gridlines: {
              color: '#f3f3f3',
              count: 5
            },
            "ticks": ticks,
            /*ticks: [{
              v: 0,
              f: 'Jan'
            }, {
              v: 1,
              f: 'Feb'
            }, {
              v: 2,
              f: 'Mar'
            }, {
              v: 3,
              f: 'Apr'
            }]*/
            /*
            slantedText:true,
            slantedTextAngle:-45*/
          },
          vAxis: {
            title: 'Dollars',
            minValue: 0,
            gridlines: {
              color: '#f3f3f3',
              count: 5
            }
          }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div1'));
        //google.visualization.AreaChart(document.getElementById('chart_div1'));
        chart.draw(custdata1, custoptions1);
    }
}

/*
    After a successfull login response, open the stroe session by unhiding/hiding appropriate HTML div's
    Adjusts navbar, then delegates setting up UID and Receipts pages to other functions.
*/
function openStoreSession(){
    $("#home").hide(); // Hide our home DIV (this is the one we see whenever we are not logged in).
    $("#store-session").fadeIn(); // Show our store-session DIV (store page).
    adjustNavbar();
}

/*
    After a successfull login response, open the business session by unhiding/hiding appropriate HTML div's
    Adjusts navbar, then delegates setting up UID and Receipts pages to other functions.
*/
function openBusinessSession(){
    $("#home").hide(); // Hide our home-div (this is the one we see whenever we are not logged in).
    $("#business-session").fadeIn(); // Show our business-session DIV (business page).
    displayStores();
    adjustNavbar();
}

/*
    Opens the login-form DIV, and hides the signup-form DIV
*/
function openLoginForm(){
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");

    $('#signup-form').hide();
    $('#login-form').fadeIn('slow');
}

/*
    Opens the signup-form DIV, and hides the login-form DIV
*/
function openSignupForm(){
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");

    $('#login-form').hide();
    $('#signup-form').fadeIn('slow');
}

/* TODO: Abhik */
function viewReceipt(receiptIndex) {
    //console.log("Clicked " + receiptIndex);

    //let result = '';
    var receipt = receipts[receiptIndex];
    //alert(receipt.name);

    //get the date
    var d = new Date(receipt.date*1000); //FIX DATE PARSING
    const dateStr = "" + (d.getMonth() + 1) +"/" + d.getDate() + "/" + d.getFullYear();

    //displays receipt header
    let result = '';
    result += '<h1 class="receipt-center">' + receipt.name + '</h1>';
    result += '<h3 class="text-center">' + dateStr + '</h3>';
    result += '<h4 class="text-center">' + 'STORE ID: ' +receipt.sid +'</h4>' ;
    result += '<table align="center" class="receiptTab" cellspacing="0">';
    result += '<thead>';
    result += '<tr class="headings">';
    result += '<th class="product">Item</td>';
    result += '<th class="price">Price</td>';
    result += '<th class="quantity">Quantity</td>';
    result += '</tr>';
    result += '</thead>';
    result += '<tbody>';

    //displays each item in receipt
    var products = receipt.item;
    for (let index of products){
        result+=    '<tr>';
        result+=    '<td class="product">'+ index.name+'</td>';
        result+=    '<td class="price">'+ index.unitcost/100 +'</td>';
        result+=    '<td class="quantity">'+ index.quantity +'</td>';
        result+=    '</tr>';
    }

    result += '</tbody>';
    result += '</table>';

    // displays receipt totals
    result += '<h4 class="text-center">' + 'Subtotal : ' + receipt.subtotal/100 + '</h4>';
    result += '<h4 class="text-center">' + 'Tax : ' + receipt.tax/100 + '</h4>';
    result += '<h4 class="text-center">' + 'Amount Due : ' + (receipt.subtotal + receipt.tax)/100 + '</h4>';

    // erases all receipts screen
    $("#customer-session").hide();
    $('#individual').fadeIn();
    //result += '<h1 class = "text-center">'+ receipt.name + ' ' + dateStr +'</h1>'
    $(".individual-receipt").html(result);
}

function viewAll(){
    $('#individual').hide();
    $("#customer-session").fadeIn();
}

/*
    Displays all receipts, called when you click the receipts button on the menu
*/
function showAllReceipts(){
    let result = '';
    //if customer signs up, no receipts to show. receipt is null
    if (!receipts || receipts.length == 0) { // no receipts, display message
        result += '<div class="no-receipts">No receipts.</div>';
    } else {
        result += '<div class="row">';
        let index = 0;
        for(let receipt of receipts){ // TODO: limit the number of receipts seen if too many in database
            var d = new Date(receipt.date*1000);
            const dateStr = "" + (d.getMonth() + 1) +"/" + d.getDate() + "/" + d.getFullYear();
            result += '<div class="col-lg-4 col-md-6 mt-3">';
            result += '<button onclick="viewReceipt(this.value)" class="receipt-list" value=' + index + '>';
            result += '<span class="left receipt-list-store">' + receipt.name + '</span>';
            result += '<span class="right receipt-list-date">' + dateStr + '</span>';
            result += '<br>';
            result += '<span class="left">';
            result += '<span class="receipt-list-subtitle"># of Items: </span>';
            result += '<span class="receipt-list-subtext">' + receipt.item.length + '</span>';
            result += '</span>';
            result += '<span class="right">';
            result += '<span class="receipt-list-subtitle">Total: $</span>';
            const total = (receipt.subtotal + receipt.tax)/100;
            result += '<span class="receipt-list-subtext">' + total + '</span>';
            result += '</span></button></div>';

            index = index + 1;
        }
        result += "</div>";
    }
     /*
     <div class="row">
        <div class="col-lg-4 col-md-6 mt-3">
            <div class="receipt-list">
            <span class="left receipt-list-store">Business</span>
            <span class="right receipt-list-date">12/12/2000</span>
            <br>
            <span class="left">
                <span class="receipt-list-subtitle"># of Items:</span>
                <span class="receipt-list-subtext">5</span>
            </span>
            <span class="right">
                <span class="receipt-list-subtitle">Total:</span>
                <span class="receipt-list-subtext">$100.20</span>
            </span>
            </div>
        </div>
    </div>
    */
    $(".show-all-receipts").html(result);
}

/*
    Receipt search bar functionality. Allows for searches of business name or date.
*/
function searchReceipt(){
    const keyword = $("#search-input").val();
    const regex = new RegExp(keyword, 'i');

    if (keyword == "" || !receipts || receipts.length == 0) { // empty search or no receipts, show all receipts
        showAllReceipts();
    } else {
        let result = '<div class="row">';
        let index = 0;
        for(let receipt of receipts){ // TODO: limit the number of receipts seen if too many in database
            var d = new Date(receipt.date*1000);
            const dateStr = "" + (d.getMonth() + 1) +"/" + d.getDate() + "/" + d.getFullYear();
            // if receipt matches with keyword as a regex
            if (receipt.name.search(regex) != -1 || dateStr.search(regex) != -1) {

                // below is copied from showAllReceipts
                result += '<div class="col-lg-4 col-md-6 mt-3">';
                result += '<button onclick="viewReceipt(this.value)" class="receipt-list" value=' + index + '>';
                result += '<span class="left receipt-list-store">' + receipt.name + '</span>';
                result += '<span class="right receipt-list-date">' + dateStr + '</span>';
                result += '<br>';
                result += '<span class="left">';
                result += '<span class="receipt-list-subtitle"># of Items: </span>';
                result += '<span class="receipt-list-subtext">' + receipt.item.length + '</span>';
                result += '</span>';
                result += '<span class="right">';
                result += '<span class="receipt-list-subtitle">Total: $</span>';
                const total = receipt.subtotal + receipt.tax;
                result += '<span class="receipt-list-subtext">' + total/100 + '</span>';
                result += '</span></button></div>';
            }
            index = index + 1;
        }
        result += "</div>";
        $(".show-all-receipts").html(result);
    }
}

/*
    !!! The following is somewhat complicated custom jQuery code for custom website functionality. !!!
*/
$(document).ready(function () {
    $('#pills-receipts-tab').on('click', function(){
        $('#pills-receipts-tab').css('background-color', 'rgb(0,0,0) !important;');
        //background-color: rgb(200,200,200) !important;
    });

    // Navbar dynamic color when scrolling
    var scroll_pos = 0;
    $(document).scroll(function () {
        scroll_pos = $(this).scrollTop();
        if (scroll_pos > 1) {
            $("#navbar").css('background-color','rgb(250,250,250)');
        } else {
            $("#navbar").css('background-color', 'transparent');
        }
    });

    // Clicking navigation-links will hide navbar
    $('#login-tab').on('click', function(){
        if($('#toggler').css('display') !='none'){
            $('#toggler').trigger( "click" );
        }
    });

    // Clicking navigation-links will hide navbar
    $('#login-tab').on('click', function(){
        if($('#toggler').css('display') !='none'){
            $('#toggler').trigger( "click" );
        }
    });

    $('#signup-btn').on('click', function(){
        if($('#toggler').css('display') !='none'){
            $('#toggler').trigger( "click" );
        }
    });

    $('#signup-btn').on('click', function(){
        if($('#toggler').css('display') !='none'){
            $('#toggler').trigger( "click" );
        }
    });

     // Cliking store login tab makes its text appear, and clears other text.
     $('#store-login-tab').on('click', function(){
        $('#store-login-text').html("Store");
        $('#business-login-text').html("");
        $('#customer-login-text').html("");
    });

    // Cliking business login tab makes its text appear, and clears other text.
    $('#business-login-tab').on('click', function(){
        $('#business-login-text').html("Business");
        $('#store-login-text').html("");
        $('#customer-login-text').html("");
    });

    // Cliking customer login tab makes its text appear, and clears other text.
    $('#customer-login-tab').on('click', function(){
        $('#customer-login-text').html("Customer");
        $('#store-login-text').html("");
        $('#business-login-text').html("");
    });


    // Set up enter function for search receipt bar
    $("#search-input").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#search-button").click();
        }
    });

    // Set up enter function for login
    $("#customer-email-login").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#customer-login-button").click();
        }
    });
    $("#customer-password-login").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#customer-login-button").click();
        }
    });
    $("#business-email-login").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#business-login-button").click();
        }
    });
    $("#business-password-login").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#business-login-button").click();
        }
    });
    $("#store-email-login").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#store-login-button").click();
        }
    });
    $("#store-password-login").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#store-login-button").click();
        }
    });

    $('#toggler').on('click', function(){
        if(!$('.navbar-nav').is(':visible')){
            $('#toggler-icon').css('background-image', 'url("/images/toggler-close.png")');
        } else {
            $('#toggler-icon').css('background-image', 'url("/images/toggler-down.png")');
        }
        $('#toggler').fadeOut(112);
        $('#toggler').fadeIn(112);
    });
    $('#login-close').click(function () {
        $('#login-form').fadeOut('slow');
        event.preventDefault();
    });
    $('#signup-close').click(function () {
        $('#signup-form').fadeOut('slow');
        event.preventDefault();
    });
    adjustNavbar();
});

/*
    This adjusts the nav-bar to be either top-centric (on desktop) or bottom-centric (on mobile).
*/
function adjustNavbar(){
    if( $('#toggler-icon').is(':visible') || window.innerWidth < 785){
        if(loggedIn){
            $('#top-navbar').hide();
            $('#bot-navbar').fadeIn('fast');
        }
        $('.footer').hide();
        $('.navbar-nav').css('border-radius', '30px 0px 0px 30px');
        $('.navbar-nav').css('margin-right', '0px');
        $('.navbar-nav').css('background-color', 'rgba(250,250,250, 0.8)');
    } else {
        if(loggedIn){
            $('#bot-navbar').hide();
            $('#top-navbar').fadeIn('fast');
        }
        $('.footer').fadeIn('fast');
        $('.navbar-nav').css('border-radius', '4px 4px 4px 30px');
        $('.navbar-nav').css('margin-right', '1vw');
        $('.navbar-nav').css('background-color', 'transparent');
    }
}

// On resize of the website, adjust the navbar.
$(window).resize(function() {
    adjustNavbar();
});

