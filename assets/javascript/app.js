$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCfnwWTMYeCKdghufbtFQZLAMKl-KYLyBY",
        authDomain: "project-1-e72e2.firebaseapp.com",
        databaseURL: "https://project-1-e72e2.firebaseio.com",
        storageBucket: "project-1-e72e2.appspot.com",
        messagingSenderId: "1084434872249"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var locations = [{
        city: "Denver",
        state: "CO"
    }, {
        city: "Atlanta",
        state: "GA"
    }, {
        city: "Austin",
        state: "TX"
    }, {
        city: "Los Angeles",
        state: "CA"
    }];
    var newCity;
    var newState;

    function showCity() {
        $(".buttons").empty();
        for (var i = 0; i < locations.length; i++) {
            var buttons = $("<button>");
            buttons.attr("data-city", locations[i].city);
            buttons.attr("data-state", locations[i].state);
            buttons.addClass("city-button");
            buttons.html(locations[i].city + ", " + locations[i].state);
            $(".buttons").append(buttons);
        }
    }
    // get Weather API results for pre-selected locations and append to page
    function displayWeather() {
        var weatherDiv = $("<div>");
        var cityName = $(this).data("city");
        var stateName = $(this).data("state");
        var queryURL = "http://api.wunderground.com/api/5c889a067ba72299/geolookup/conditions/q/" + stateName + "/" + cityName + ".json";
        $(document).ready(function($) {
            $.ajax({
                url: queryURL,
                dataType: "jsonp",
                success: function(parsed_json) {
                    var location = parsed_json["current_observation"]["display_location"]["full"];
                    var weather = parsed_json["current_observation"]["temp_f"];
                    var humidity = parsed_json["current_observation"]["relative_humidity"];
                    var windSpeed = parsed_json["current_observation"]["wind_mph"];
                    var windDirection = parsed_json["current_observation"]["wind_dir"];
                    var weatherIcon = $("<img>");
                    weatherIcon.attr("src", parsed_json["current_observation"]["icon_url"]);
                    var temp = parsed_json["current_observation"]["weather"];
                    // var forecast = parsed_json["forecast"]["simpleforecast"]["forecastday"]["date"];
                    // var forecast = parsed_json["forecast"]["txt_forecast"]["forecastday.indexOf[0]"];
                    // prepend the weatherDiv to the page
                    weatherDiv.append("Location: " + location);
                    weatherDiv.append("...Temperature: " + weather + "\xB0F...");
                    weatherDiv.append("...Humidity: " + humidity + "...");
                    weatherDiv.append("...Wind Speed: " + windSpeed + " mph...");
                    weatherDiv.append("...Wind Direction: " + windDirection + "...");
                    weatherDiv.append(weatherIcon);
                    weatherDiv.append("..." + temp);
                    $(".cities").prepend(weatherDiv);
                }
            });
        });
    }
    // get Weather API results for new locations and append to page
    function displayNewWeather() {
        var newWeatherDiv = $("<div>");
        var queryURL = "http://api.wunderground.com/api/5c889a067ba72299/geolookup/conditions/q/" + newState + "/" + newCity + ".json";
        $(document).ready(function($) {
            $.ajax({
                url: queryURL,
                dataType: "jsonp",
                success: function(parsed_json) {
                    var location = parsed_json["current_observation"]["display_location"]["full"];
                    var weather = parsed_json["current_observation"]["temp_f"];
                    var humidity = parsed_json["current_observation"]["relative_humidity"];
                    var windSpeed = parsed_json["current_observation"]["wind_mph"];
                    var windDirection = parsed_json["current_observation"]["wind_dir"];
                    var weatherIcon = $("<img>");
                    weatherIcon.attr("src", parsed_json["current_observation"]["icon_url"]);
                    var temp = parsed_json["current_observation"]["weather"];
                    // var forecast = parsed_json["forecast"]["simpleforecast"]["forecastday"]["date"];
                    // var forecast = parsed_json["forecast"]["txt_forecast"]["forecastday.indexOf[0]"];
                    // prepend the weatherDiv to the page
                    newWeatherDiv.append("Location: " + location);
                    newWeatherDiv.append("...Temperature: " + weather + "\xB0F...");
                    newWeatherDiv.append("...Humidity: " + humidity + "...");
                    newWeatherDiv.append("...Wind Speed: " + windSpeed + " mph...");
                    newWeatherDiv.append("...Wind Direction: " + windDirection + "...");
                    newWeatherDiv.append(weatherIcon);
                    newWeatherDiv.append("..." + temp);
                    $(".new-cities").prepend(newWeatherDiv);
                },
                error: function(error) {
                    alert('error; ' + eval(error));
                }
            });
        });
    }
    // create on click event handler to take user city and state input and populate new city
    $("#add-user-input").on("click", function() {
        newCity = $("#city-input").val().trim();
        newCityDB = newCity.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        newState = $("#state-input").val().trim();
        newStateDB = newState.toUpperCase();
        database.ref().push({
            newCity: newCityDB,
            newState: newStateDB,
        })
        displayNewWeather();
        $("#city-input").val("");
        $("#state-input").val("");
        // prevents page from refreshing when user submits input
        return false;
    })
    // when user input is added to Firebase, append the stored values to the page
    database.ref().on("child_added", function(childSnapshot) {
        $(".added-train").append("<tr>+<td>" + "<button>Destination Link</button>" + "<td>" + childSnapshot.val().newCity + "<td>" + childSnapshot.val().newState);
    });
    // create on click event handler to display the weather if any of the topic buttons are clicked
    $(document).on('click', ".city-button", displayWeather);
    // run function to show the topics buttons
    showCity();
});
// Get the modal
var modal = document.getElementById('myModal');
var btn = document.getElementById("log-in");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}