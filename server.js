// Server dependencies
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");

// New express app
var app = express();

// Setting port for listener
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// Using mongo and mongoose for data base
/*
mongoose.connect("");

//MongoDB configuration (Change this URL to your own DB)
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Successful Mongoose Connection.");
}); 
*/

// Setting main route
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

// Start server
app.listen(PORT, function() {
	console.log("App listening on PORT: " + PORT);
});