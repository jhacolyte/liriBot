//vars
require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var axios = require('Axios');

//var Spotify = require('spotify-web-api-node');
var Spotify = require('node-spotify-api');
//creates log.txt file
var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}
function getConcert(){
    var bandName = secondCommand;
var queryURL = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";

    
    console.log(queryURL); 

    axios.get(queryURL).then(
        function(bandResponse){
            console.log("Venue: " + bandResponse.data[0].venue.name);
            console.log("City: " + bandResponse.data[0].venue.city);
            console.log((bandResponse.data[0].datetime));
        }
    );
};


// Fetch Spotify Keys
var spotify = new Spotify(keys.spotify);

// Writes to the log.txt file
var getArtistNames = function(artist) {
    return artist.name;
};

function getSpotify() {
var songName = secondCommand;
// Function for running a Spotify search - Command is spotify-this-song

spotify.request('https://api.spotify.com/v1/search?q=track:' + songName + '&type=track&limit=10', function(error, songResponse) {
    if (error){
        return console.log(error);
    }
    console.log("Artist: " + songResponse.tracks.items[0].artists[0].name);
    console.log("Song: " + songResponse.tracks.items[0].name);
    console.log("URL: " + songResponse.tracks.items[0].preview_url);
    console.log("Album: " + songResponse.tracks.items[0].album.name);
});
}


//Switch command
function mySwitch(userCommand) {

    //choose which statement (userCommand) to switch to and execute
    switch (userCommand) {

        case "concert-this":
            getConcert();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }

    //OMDB Movie - command: movie-this
    function getMovie() {
        // OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
        var movieName = secondCommand;
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function(error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                
                // var body = JSON.parse(body);

                //Simultaneously output to console and log.txt via NPM simple-node-logger
                console.log('================ Movie Info ================');
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("IMdB Rating: " + JSON.parse(body).imdbRating);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
                console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
                console.log('==================THE END=================');

            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === JSON.parse(body).Title) {
                console.log("-----------------------");
                console.log("If you haven't watched" + JSON.parse(body).Title, " then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on ThePirateBay!");
            }
        });
    }

    //Function for command do-what-it-says; reads and splits random.txt file
    //command: do-what-it-says
    function doWhat() {
        //Read random.txt file
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (!error);
            console.log(data.toString());
            //split text with comma delimiter
            var cmds = data.toString().split(',');
        });
    }



} //Closes mySwitch func - Everything except the call must be within this scope

//Call mySwitch function
mySwitch(userCommand);