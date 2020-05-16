
var loggedIn = false;
var receipts = null;
var UID = null;


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
    //.then(response => response.json())  // => Uncomment whenever backend implements "/customer-login"
    // Displaying results to console
    .then(json => {
        var someCustomResponse = { // => CUSTOM response message that I made (should be similar to what we expect).
            "login": true,
            "cid" : "123123",
            "receipts": [
                    {
                    "rid" : 123,
                    "sid" : 321,
                    "store": "Ralph's",
                    "date" : "1589255024",
                    "tax" : 99, // in cents,
                    "subtotal" : 1000, // in cents
                    "other" : "some custom text",
                    "items" : [
                                {
                                    "name" : "tomato",
                                    "quantity" : 2,
                                    "unitcost" : 99 // in cents
                                },
                                {
                                    "name" : "A in cse110",
                                    "quantity" : 10,
                                    "unitcost" : 0 // in cents
                                }
                              ]
                    },
                    {
                        "rid" : 420,
                        "sid" : 321,
                        "store": "Vons",
                        "date" : "1589000000",
                        "tax" : 99, // in cents,
                        "subtotal" : 1000, // in cents
                        "other" : "some custom text",
                        "items" : [
                                    {
                                        "name" : "more tomatoes",
                                        "quantity" : 20,
                                        "unitcost" : 4004 // in cents
                                    },
                                    {
                                        "name" : "F in cse110",
                                        "quantity" : 0,
                                        "unitcost" : 100 // in cents
                                    }
                                  ]
                    }
                    ]
            }; // => END of CUSTOM response

        // Check if the response's "login" field is true (SUCCESS).
        try{
            if(someCustomResponse.login){
                loggedIn = true;
                receipts = someCustomResponse.receipts;
                UID = someCustomResponse.cid;
                openCustomerSession();
            }
        } catch(err) {
            alert(err); // If there is ANY error here, then send an alert to the browser.
        }
    })
    .catch((error) => { // If there is an error in our POST response (404 error, no server found, etc...), alert the browser.
        alert(error);
    });

    event.preventDefault(); // Prevent page from reloading.
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
    })
    .catch((error) => {
        alert(error);
    });

    event.preventDefault(); // Prevent page from reloading.
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

    // Ensure password == confirm-password before attempting to signup.
    if(passwordVal == confirmVal){

    } else {
        $(".error").html("Passwords do not match."); // Set user-visible error text field.
    }

    event.preventDefault(); // Prevent page from reloading.
}

/*
    Called whenever the store "signup!" button is clicked.
    Grabs the approriate HTML fields, ensures password == confirm-password.
    Then, makes a POST request on "/store-signup" to the server to try to signup.
*/
function storeSignup() {
    // Clear the User-Visible error field (exists for letting user know passwords dont match, etc..)
    $(".error").html("");

    // Grab appropriate values from HTML fields.
    const nameVal = $("#store-name-signup").val();
    const addressVal = $("#store-address-signup").val();
    const passwordVal = $("#store-password-signup").val();
    const confirmVal = $("#store-password-confirm").val();

    // Ensure password == confirm-password before attempting to signup.
    if(passwordVal == confirmVal){

    } else {
        $(".error").html("Passwords do not match."); // Set user-visible test field.
    }

    event.preventDefault(); // Prevent page from reloading.
}

/*
After a successfull login response, open the customer session by unhiding/hiding appropriate HTML div's
Adjusts navbar, then delegates setting up UID and Receipts pages to other functions.
*/
function openCustomerSession(){
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
