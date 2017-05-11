var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creates Schema
var ChordsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
  	type: String,
  	required: true
  },
  image_url: {
  	type: String,
  	required: true
  }
});


// Creates model with Schema
var Chords = mongoose.model("Chords", ChordsSchema);

module.exports = Chords;
