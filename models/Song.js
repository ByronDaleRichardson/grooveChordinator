var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creates Schema
var SongSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  html: {
    type: String,
    required: true
  },
  chords: [{
    type: Schema.Types.ObjectId,
    ref: "Chords"
  }],
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }],  
  saved: {
    type: Boolean,
    required: true,
    default: false
  }
});

// Creates model with schema
var Song = mongoose.model("Song", SongSchema);

module.exports = Song;
