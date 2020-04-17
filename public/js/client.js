
var loggedIn = false;

// Client-side login function, called from the index.html's 'login' button.
function login() {
    loggedIn = true;
    // Create an HTTP Request object
    const httpRequest = new XMLHttpRequest();

    // Make this a 'POST' http request
    // => create a 'POST' request for the server-side 'login' method.
    httpRequest.open("post", "/login", true);

    // Set the header of the http post-request to know to encode a generic json structure.
    httpRequest.setRequestHeader("Content-type", "application/json");

    // Send a "stringified" JSON structure on the POST request
    httpRequest.send(JSON.stringify(
        { // This is the JSON structure we are sending.
            email: document.getElementById("email-login").value,
            password: document.getElementById("password-login").value
        }
    ));

    if(loggedIn) {
        $('#home').hide();
        $('#session').fadeIn('slow');
        adjustNavbar();
    }
    event.preventDefault();

}

function openLogin(){
    $('#signup-form').hide();
    $('#login-form').fadeIn('slow');
}

function openSignup(){
    $('#login-form').hide();
    $('#signup-form').fadeIn('slow');
}

// jQuery Code
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
    $('.nav-link').on('click', function(){ 
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
        }else {
            $('#toggler-icon').css('background-image', 'url("/images/toggler.png")')
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

function adjustNavbar(){
    if( $('#toggler-icon').is(':visible') || screen.width < 768){
        if(loggedIn){
            $('#top-navbar').fadeOut('slow');
            $('#bot-navbar').fadeIn('slow');
        }
        $('.navbar-nav').css('border-radius', '30px 0px 0px 30px');
        $('.navbar-nav').css('margin-right', '0px');
        $('.navbar-nav').css('background-color', 'rgba(250,250,250, 0.8)');
    } else {
        if(loggedIn){
            $('#bot-navbar').fadeOut('slow');
            $('#top-navbar').fadeIn('slow');
        }
        $('.navbar-nav').css('border-radius', '4px 4px 4px 30px');
        $('.navbar-nav').css('margin-right', '1vw');
        $('.navbar-nav').css('background-color', 'transparent');
    }
}
// On resize, adjust navbar.
$(window).resize(function() {
    adjustNavbar();
});