//Import module for hiding keys
require("dotenv").config();
//set the user command as a variable
var userCommand = process.argv[2];
//set the user request as a variable
var userRequest = process.argv[3];
//import the module for reading and writing to txt files
var fs = require("fs");
//import the moment module for formatting time
var moment = require("moment")
//import Spotify keys from keys.js
var keys = require("./keys.js");
//import axios for Bands In Town and OMDB APIs
var axios = require("axios");
//In case of CLI error, and also to let users know that their response is loading
console.log("loading...")
console.log("loading...")
console.log("loading...")
console.log("loading...")
console.log("loading...")
console.log("loading...")
console.log("\n\n")
//import node spotify api module
var Spotify = require('node-spotify-api');
//create spotify variable as outlined in documentation
var spotify = new Spotify(keys.spotify);

//function to discern command and choose which function to run
function doThis(command, request) {
    switch (command) {

        case "concert-this":
            concertThis(request);
            break;

        case "spotify-this-song":
            spotifyThis(request);
            break;

        case "movie-this":
            movieThis(request);
            break;

        case "do-what-it-says":
            doRandom();
            break;

        default:
            console.log("Command not recognized. Valid commands are `concert-this`, `spotify-this-song`, `movie-this`, and `do-what-it-says`");
    }
}

//calls bands in town API to check for concerts based on user's request
function concertThis(artist) {
    var band;
    //if there is no user input, search for The Rolling Stones
    if (artist) {
        band = artist;
    }
    else {
        band = "The Rolling Stones"
    }

    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp").then(
        function (response) {

            var results = response.data

            console.log(results[0].lineup[0] + " is playing at the following events:");

            for (var i = 0; i < results.length; i++) {
                if (results[i].venue.country == "United States") {
                    console.log(results[i].venue.name + " in " + results[i].venue.city + ", " + results[i].venue.region + " on " + moment(results[i].datetime).format("MM/DD/YYYY"));
                }
                else {
                    console.log(results[i].venue.name + " in " + results[i].venue.city + ", " + results[i].venue.country + " on " + moment(results[i].datetime).format("MM/DD/YYYY"));
                }
            }
        })

        .catch(function (error) {
            if (error.response) {
                console.log(error.response);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Unfortunately, " + band + " is not playing any upcoming shows.")
            }
        });

}

//calls spotify API to check for a song based on user's request
function spotifyThis(track) {

    var song;
    //if there is no user input, search for The Sign, by Ace of Base
    if (track) {
        song = track;
    }
    else {
        song = "the sign ace of base"
    }

    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            console.log(response.tracks.items[0].name + " is track " + response.tracks.items[0].track_number + " on " + response.tracks.items[0].artists[0].name + "'s album " + response.tracks.items[0].album.name + ".");
            console.log("You can listen to the this track here: " + response.tracks.items[0].external_urls.spotify);

        })
        .catch(function (err) {
            console.log("Cannot find track, try again");
        });

}

//calls OMDB API to check for a movie based on user's request
function movieThis(movie) {

    var film;
    //if there is no user input, search for Mr. Nobody
    if (movie) {
        film = movie;
    }
    else {
        film = "Mr. Nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + film + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("In " + response.data.Title + ", " + response.data.Plot);
            console.log(response.data.Title + " was released in " + response.data.Year + " and received a rating of " + response.data.Ratings[0].Value + " on IMDB and " + response.data.Ratings[1].Value + " on Rotten Tomatoes.");
            console.log("Language: " + response.data.Language.split(",")[0]);
            console.log("Produced in: " + response.data.Country);
            console.log("Starring: " + response.data.Actors);
        })
        .catch(function (error) {
            if (error.response) {
                console.log("Try again");
            } else if (error.request) {
                console.log("Bad request");
            } else {
                console.log("Error", error.message);
            }
            console.log("Movie not found, try again!");
        });
}

//reads the random.txt file and runs the command written to the file
function doRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        var randomCommand = data.split(",")[0];
        var randomRequest = data.split(",")[1]
        randomRequest = randomRequest.slice(1, -1);

        doThis(randomCommand, randomRequest);
    });
}

//runs the doThis function for the user's command and request
doThis(userCommand, userRequest);