
var loggedIn = false;
var receipts = null;
var UID = null;
var busername = null;
var bpassword = null;
var stores = [];


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
    if(emailVal.length === 0 || passwordVal.length === 0){
        $(".error").html("Username and password should not be empty");
    }else{
        console.log("Sending POST request...");

        // POST request using fetch()  on "/customer-login"
        fetch("/customer-login", {
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
        .then(response => response.json())  // => Uncomment whenever backend implements "/customer-login"
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
                    $(".error").html("Username or password is incorrect");
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
    console.log(passwordVal)
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

    fetch("/store-signup",{
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
                loggedIn = true;
                UID = json.sid;
                openStoreSession();
                stores.push(UID);
            }else{
                //some error
                $(".store-error").html("Username already exists");
            }
        }catch(err) {
            alert(err); // If there is ANY error here, then send an alert to the browser.
        }
    });

    event.preventDefault();
}

function displayStores(){
    let result = "<table>";
    result += "<th> Index </th>";
    result += "<th> SID </th>"
    let index = 1;
     for(let store of stores){
        result += "<tr><td>" + index + "</td><td>" + store + "</td></tr>";
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

    console.log("Sending POST request...");

    // POST request using fetch()  on "/store-login"
    fetch("/store-login", {
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

    })
    .catch((error) => {
        alert(error);
    });

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
    console.log(emailVal + passwordVal);
    busername = emailVal
    bpassword = passwordVal
    console.log("Sending POST request...");

    // POST request using fetch()
    fetch("/business-login", {
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
        console.log(json)
        try{
            if(json.login){
                loggedIn = true;
                receipts = json.receipts;
                UID = json.bid;
                stores = json.stores;
                console.log(stores);
                openBusinessSession();
            } else{
                $(".error").html("Username or password is incorrect");
            }
        } catch(err) {
            alert(err); // If there is ANY error here, then send an alert to the browser.
        }
    })
    .catch((error) => {
        alert(error);
    });

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
        fetch("/customer-signup",{
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
                    $(".error").html("Username already exists");
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
    const addressVal = $("#business-address-signup").val();
    const passwordVal = $("#business-password-signup").val();
    const confirmVal = $("#business-password-confirm").val();
    busername = emailVal;
    bpassword = passwordVal;
    console.log(nameVal+emailVal+passwordVal);
    // Ensure password == confirm-password before attempting to signup.
    if(nameVal.length === 0){
        $(".error").html("Email cannot be empty");
    }else if(checkPasswordConditions(passwordVal,confirmVal)){
        fetch("/business-signup",{
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
                    $(".error").html("Username already exists");
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

    console.log("Opened customer session.");

    // Set up our UID-text to be equal to our UID
    $("#uid-text").html(UID);
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

    $('#toggler').on('click', function(){
        if(!$('.navbar-nav').is(':visible')){
            $('#toggler-icon').css('background-image', 'url("/images/toggler-close.png")')
        } else {
            $('#toggler-icon').css('background-image', 'url("/images/toggler-down.png")')
        }
        $('#toggler').fadeOut(112)
        $('#toggler').fadeIn(112)
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
    if( $('#toggler-icon').is(':visible') || screen.width < 768){
        if(loggedIn){
            $('#top-navbar').hide();
            $('#bot-navbar').fadeIn('fast');
        }
        $('.navbar-nav').css('border-radius', '30px 0px 0px 30px');
        $('.navbar-nav').css('margin-right', '0px');
        $('.navbar-nav').css('background-color', 'rgba(250,250,250, 0.8)');
    } else {
        if(loggedIn){
            $('#bot-navbar').hide();
            $('#top-navbar').fadeIn('fast');
        }
        $('.navbar-nav').css('border-radius', '4px 4px 4px 30px');
        $('.navbar-nav').css('margin-right', '1vw');
        $('.navbar-nav').css('background-color', 'transparent');
    }
}

// On resize of the website, adjust the navbar.
$(window).resize(function() {
    adjustNavbar();
});
