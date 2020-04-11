
// Client-side login function, called from the index.html's 'login' button.
function login() {
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
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }
    ));

    // Alert the web-browser/html file that we successfully ran this method.
    alert("Ran!");
}

// TODO
function signup() {
    // shouldn't be too hard... same thing as login but server has to check 
    // if it already exists and send a call-back message of whether it failed/succeeded.
}


// Some jQuery code
$(document).ready(function () {

    var scroll_pos = 0;
    $(document).scroll(function () {
        scroll_pos = $(this).scrollTop();
        if (scroll_pos > 1) {
            $("#navbar").css('background-color','rgb(250,250,250)');
        } else {
            $("#navbar").css('background-color', 'transparent');
        }
    });

    $('.nav-link').on('click', function(){ 
        if($('#toggler').css('display') !='none'){
            $('#toggler').trigger( "click" );
        }
    });

    $('#login-form').hide();

    $('#login-tab').click(function () {
        $('#login-form').fadeIn('slow');
    });

    $('#login-close').click(function () {
        $('#login-form').fadeOut('slow');
    });
});

$(window).resize(function() {
    if( $('#toggler-icon').is(':visible')){
        $('.navbar-nav').css('border-radius', '30px 0px 0px 30px');
        $('.navbar-nav').css('margin-right', '0px');
    }else {
        $('.navbar-nav').css('border-radius', '4px 4px 4px 30px');
        $('.navbar-nav').css('margin-right', '1vw');
    }
});