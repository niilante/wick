$(document).ready(function() {

    var frame = document.getElementById("viewer-frame");

    var page = window.location.hash.replace("#", '');
    if(page !== '') {
        frame.src = "site/pages/" + page + ".html";
    }

    $( ".logo" ).click(function() {
        frame.src = "site/pages/home.html"
        window.location.hash = ""
    });

    $( ".create-button" ).click(function() {
        frame.src = "site/pages/create.html"
        window.location.hash = "create"
    });

    $( ".explore-button" ).click(function() {
        frame.src = "site/pages/explore.html"
        window.location.hash = "explore"
    });

    $( ".learn-button" ).click(function() {
        frame.src = "site/pages/learn.html"
        window.location.hash = "learn"
    });

    $( ".reference-button" ).click(function() {
        frame.src = "site/pages/reference.html"
        window.location.hash = "reference"
    });

    $( ".about-button" ).click(function() {
        frame.src = "site/pages/about.html"
        window.location.hash = "about"
    });

    $( ".community-button" ).click(function() {
        frame.src = "site/pages/community.html"
        window.location.hash = "community"
    });

});
