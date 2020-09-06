const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Music');

const music = mongoose.Schema({
  song_id:{type:Number,default:1},
  name:String,
  thumbnail:String,
  directory:String,
  artist:String,
});
module.exports = mongoose.model('song',music);