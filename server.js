// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Required models
var Song = require("./models/Song.js");
var Chords = require("./models/Chords.js");
var Note = require("./models/Note.js");

// API tool
var request = require("request");

// Setting mongoose to use ES6 promises
mongoose.Promise = Promise;

// Initializing express
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// BodyParser makes it possible for our server to interpret data sent to it.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var PORT = process.env.PORT || 3000;

// Make public a static dir
app.use(express.static("app"));

// DB config with mongoose
//mongoose.connect("mongodb://heroku_7dkl62zv:pjp9994gns6nd4si7hsh4khk2c@ds133261.mlab.com:33261/heroku_7dkl62zv");
mongoose.connect("mongodb://localhost:guitarSearch");
var db = mongoose.connection;

db.on("error", function(err){
  console.log("Mongoose error: ", err);
});

db.once("open", function(){
  console.log("Mongoose connection successful");
});

app.get("/", function(req, res){
  Song.find({"saved": false}, function(err, doc){
    var hbsobj = {
      songs: doc
    }
    console.log(hbsobj);
    res.render("index", hbsobj);
  });
});

app.get("/search",function(req, res){
  res.render("search");
});

app.get("/api/search/:searchTerm", function(req, res){
  var searchTerm = req.params.searchTerm;
  var options={
    url:"http://api.guitarparty.com/v2/songs/",
    qs:{
      query: searchTerm
    },
    headers:{
      "Guitarparty-Api-Key": "c17fbe4fc589d2eb77e6413d03bb9f53d66668b7",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
    }
  };
  request.get(options, function(error, response, body){
    var fromAPI = JSON.parse(body);
    console.log(error, response.statusCode, body);
    res.setHeader('Content-Type', 'application/json');
    res.json(fromAPI);
  });
});


//res.render("search");

app.get("/display", function(req, res){
  res.render("display");
});

app.get("/saved", function(req, res){
  Song.find({"saved": true}, function(err, doc){
    var hbsobj = {
      songs: doc
    }
    console.log(hbsobj);
    res.render("saved", hbsobj);
  });
});

app.post("/saved/:id", function(req, res){
  var songID = req.params.id;
  console.log(songID);

  Song.findOneAndUpdate({"_id":songID}, {"saved": true})
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.send(200);
    }
  })

});

app.post("/unsaved/:id", function(req, res){
  var songID = req.params.id;
  console.log(songID);

  Song.findOneAndUpdate({"_id":songID}, {"saved": false})
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.send(200);
    }
  })

});

app.post("/notes/:id", function(req, res){
  var songID = req.params.id;
  var newNote = new Note({body: req.body.text});

  newNote.save(function(err, doc){
    if (err) {
      console.log(err);
    } else {
      Song.findOneAndUpdate({"_id":songID}, {$push: {"notes": doc._id}})
      .exec(function(err, doc){
        if (err){
          console.log(err);
        }else {
          res.send(200);
        }
      });
    }
  });

});

app.get("/notes/:id", function(req, res){
  var songID = req.params.id;
  console.log(songID);
  Song.findOne({"_id":songID})
  .populate("notes")
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.json(doc);
    }
  })

});

app.post("/delete/:id", function(req, res){
  var _id = req.params.id;

  Note.remove({"_id":_id}, function(err){
    if(err){
      console.log(err);
    }else{
      res.send(200);
    }
  });

});

//Listen on PORT
app.listen(PORT, function(){
  console.log("App running on port " + PORT );
});
