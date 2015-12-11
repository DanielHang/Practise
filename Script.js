var today = new Date();
document.getElementById('current-year').innerHTML = today.getFullYear();

var canvas = document.getElementById("demo-canvas");
context = canvas.getContext("2d");
var grd = context.createLinearGradient(0, 100, 0, 200);
grd.addColorStop(0, "red");
grd.addColorStop(1, "white");

context.fillStyle = grd;
context.fillRect(0, 0, 200, 200);

context.beginPath();
context.moveTo(10, 10);
context.lineTo(190, 190);
context.lineWidth = 2;
context.stroleStyle = '#0000ff';
context.lineCap = 'butt';
context.stroke();

context.beginPath();
context.moveTo(10, 10);
context.quadraticCurveTo(50, 200, 200, 50);
context.bezierCurveTo(0, 0, 100, 150, 30, 200);
context.moveTo(95, 50);
context.arc(95, 50, 40, 0, 2 * Math.PI);
context.moveTo(95, 150);
context.arc(95, 150, 40, 1.5 * Math.PI, 0.5 * Math.PI);
context.lineWidth = 5;
context.stroleStyle = "blue";
context.lineCap = 'butt';
context.stroke();

context.font = "30px Arial";
context.fillStyle = "blue";
context.fillText("Canvas Art", 10, 50);

var x = document.getElementById("map-demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
    + latlon + "&zoom=14&size=350x270&sensor=false";
    document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

$(document).ready(function () {
    // Each paragraph receives a "click" action:
    // hide that particular paragraph.
    $(".clickaway").click(function () {
        $(this).hide();
    });

    $("#clickaway-restore").click(function () {
        $(".clickaway").show();
    });

    $(".clicktowards-add").click(function () {
        $(".clicktowards-container").append("<div class=\"clicktowards\"></div>");
    });


});

function init() {
    animateJs = document.getElementById("animate-js");
    animateJs.style.position = "relative";
    current = 0;
    move_animateJs();

    //clock
    var canvas_clock = document.getElementById("clockface");
    //Global variables created
    dctx = canvas_clock.getContext('2d');
    dctx.fillStyle = "red";
    center_x = 100;
    center_y = 100;
    length = 100;
    show_hands();

    //Build weather based on geolocation
    getWeatherLocation();


    //Set username from cookie
    GetNameFromCookie();

    //SetVisitCount
    VisitCount();
}

function fadeIn() {
    $('.start-hidden').css("display", "initial");
}

function move_animateJs() {
    next = current + "px";
    current += 1;
    if (current > 200) {
        current = 0;
    }
    animateJs.style.top = next;

    var rate = document.getElementById("rate").value; ; ;
    setTimeout(move_animateJs, rate);
}

//Show images
function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;
    // Adds it to the <body> tag
    $(".show-image").append(img);
}


//Clock
//Draw Line from center to edge of clock face given time fraction
function draw_leg(fraction) {
    dctx.lineTo(center_x + length * Math.sin(2 * Math.PI * fraction), center_y - length * Math.cos(2 * Math.PI * fraction));
}

//Draw single hand - Isosceles Triangle given time fraction and hand width
function show_hand(fraction, width) {
    dctx.beginPath();
    dctx.moveTo(center_x, center_y);
    draw_leg(fraction - width);
    draw_leg(fraction + width);
    dctx.fill();
}

//Get time in individual units
function getTime() {
    var now = new Date();
    //Assign to global variables
    seconds = now.getSeconds();
    minutes = now.getMinutes() + seconds / 60;
    hours = now.getHours() + minutes / 60;
}

//build clock
function show_hands() {
    //Erase hands
    dctx.clearRect(0, 0, 200, 200);

    getTime();
    //Draw hands
    show_hand(seconds / 60, 0.002);
    show_hand(minutes / 60, 0.005);
    show_hand(hours / 12, 0.01);

    //Refreash rate 1000ms
    var rate = 1000;

    setTimeout(show_hands, rate);
}


//weather web request
function XmlRequest() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var jsonResponse = JSON.parse(xhr.responseText);
            if (jsonResponse.hasOwnProperty('main'))
                DisplayWeather(jsonResponse);
        }
    };

    xhr.open('GET', weatherUrl, true);
    xhr.send();
}


//Build the URL for the weather service based on geolocation
// API-KEY = 05316d2615a2992b65a02a925dea782b
function UrlGeoWeather(currentPos) {
    //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
    weatherUrl = "http://api.openweathermap.org/data/2.5/weather?";
    weatherUrl += "lat=" + currentPos.coords.latitude;
    weatherUrl += "&lon=" + currentPos.coords.longitude;
    weatherUrl += "&units=metric";
    weatherUrl += "&appid=" + "05316d2615a2992b65a02a925dea782b";
}

//Display the weather given a JSON object
function DisplayWeather(jsonObject) {
    var weatherReport = "<h6>Weather today</h6>";
    if (jsonObject.hasOwnProperty('weather'))
        weatherReport += "<p>" + jsonObject.weather[0].description + "</p>";
    if (jsonObject.hasOwnProperty('main')) {
        if (jsonObject.main.hasOwnProperty('temp'))
            weatherReport += "<p>Temperature: " + jsonObject.main.temp + "&deg; C</p>";
        if (jsonObject.main.hasOwnProperty('pressure'))
            weatherReport += "<p>Atmospheric Pressure: " + jsonObject.main.pressure + "hPa</p>";
        if (jsonObject.main.hasOwnProperty('humidity'))
            weatherReport += "<p>Humidity: " + jsonObject.main.humidity + "%</p>";
    }
    if (jsonObject.hasOwnProperty('speed'))
        weatherReport += "<p>Wind Speed: " + jsonObject.wind.speed + "m/s</p>";

    document.getElementById("weather-services").innerHTML = weatherReport;
}

function getWeatherLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(UrlGeoWeather, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

// JS Validation
function FormCorrect() {
    var input_object = document.getElementById("form-serial");
    var value = input_object.value;
    var current_length = value.length;
    if (current_length) {
        var last_character = value.substring(current_length - 1);
        switch (current_length) {
            case 4:
            case 8:
            case 11:
                if (last_character != '-') {
                    value = value.substring(0, current_length - 1);
                }
                break;
            default:
                if (!/\d/.test(last_character)) {
                    value = value.substring(0, current_length - 1);
                }
        }
        if (current_length > 12) {
            value = value.substring(0, current_length - 1);
        }
        current_length = value.length;
        switch (current_length) {
            case 3:
            case 7:
            case 10:
                value += "-";
        }
        input_object.value = value;
    }
};



//Cookie SET
function setCookie(cookieName, cookieValue, expireryDays) {
    var date = new Date();
    date.setTime(date.getTime() + (expireryDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; " + expires;
}

//Cookie GET
function getCookie(cookieName) {
    var name = cookieName + '=';
    var cookieArray = document.cookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookieItem = cookieArray[i];
        while (cookieItem.charAt(0) == ' ') {
            cookieItem = cookieItem.substring(1);
        }
        if (cookieItem.indexOf(name) == 0) {
            return cookieItem.substring(name.length, cookieItem.length);
        }
    }
    return "";
}

//Add username to dom from cookie 
function GetNameFromCookie() {
    var user = getCookie("username");
    if (user != "") {
        document.getElementById("username-cookie").innerHTML = "<p>Welcome " + user + "!</p>";
    }
}

//Add username to cookie from form
function SetUsername() {
    var username = document.getElementById('set-username').value;
    if (username != "" && username != null) {
        setCookie("username", username, 10);
    }
}

//VisitCount Local Storage
function VisitCount() {
    var visitCount = localStorage.visitCount;
    if (visitCount == null || visitCount == '') {
        localStorage.visitCount = 1;
        document.getElementById('visit-count').innerHTML = "<p> This is your first visit to this site.</p>";
    }
    else {
        localStorage.visitCount++;
        document.getElementById('visit-count').innerHTML = "<p> You have visited this site " + visitCount + " times.</p>";
    }
}


//Click to get location
var geoLoca = document.getElementById("geoloca");
function GetLoca() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocaPosition, showLocaError)
    } else {
        geoLoca.innerHTML = "Geolocation is not supported";
    }
}


function showLocaPosition(position) {
    geoLoca.innerHTML = "Latitude: "+ position.coords.latitude +"<Br />Longitude:" + position.coords.longitude;
}

function showLocaError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            geoLoca.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            geoLoca.innerHTML = "Location infomation is unavailable.";
            break;
        case error.TIMEOUT:
            geoLoca.innerHTML = "The request to get geolocation has timed out.";
            break;
        case error.UNKNOWN_ERROR:
            geoLoca.innerHTML = "An unknown error has occured.";
            break;
    }
}