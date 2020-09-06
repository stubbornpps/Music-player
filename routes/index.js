const express = require('express');
const Music = require('./users');
const multer = require('multer');
const router = express.Router();
var new_id;
var total_Track;
var track_index=1;
//function sections
//multer
let storage = multer.diskStorage({
  destination: function(req, file,cb){
    cb(null, './public/songs');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  } 
})
let upload = multer({ storage: storage });
//multer
//increment
var id_increment = () =>{
  Music.findOne({},{song_id:1,_id:0}).sort({"song_id":-1}).exec().then((fetch_id)=>{
    new_id=++fetch_id.song_id;  
  })
  .catch((err)=>{
      throw err;
  })
} 
//song length
var song_length = () =>{
  return Music.find({}).then(trackno => trackno)
}
song_length().then(totalTrack=>total_Track=totalTrack.length);

/* GET home page. */
router.get('/', function(req, res, next){
  
  Music.find({},function(err,songs){
      if(err){console.log(err);}
      else{
        res.render('index',{songlist:songs});      
      }
  });
}); 
router.get('/add',function(req,res){
  id_increment();  
  res.render('Add');
});
router.post('/song',upload.single('Song'),function(req,res){
  let db = new Music();
  db.song_id =new_id;
  db.name = req.file.originalname;
  db.thumbnail = req.body.thumbnail;
  db.directory = 'http://'+req.headers.host+'/songs/'+req.file.originalname;
  db.artist = req.body.Artist;
  db.save(function(err,song){
    if(err){res.send(err);}
    else{
      res.redirect('/');
    }
  })
});
router.post('/nextsong',function(req,res){
  Music.findOne({directory:req.body.song_Path},function(err,songs){
    if(err){
      res.json({
        'status':0,
        'error':'Error While processing'
      })
    }
    else{
      if(songs.song_id>=total_Track){
        track_index=2;
      }
      else{
        track_index++;
      }        
      Music.findOne({song_id:track_index},function(err,next_song){
        if(err){
          res.json({
            'status':0,
            'error':'Error while changing song'
          });
        }
        else{
          res.json({
            'status':1,
            "next_Song":next_song
          })
        }
      })
    }
  });
});
router.post('/previoussong',function(req,res){
  Music.findOne({directory:req.body.song_Path},function(err,songs){
    if(err){
      res.json({
        'status':0,
        'error':'Error While processing'
      })
    }
    else{
      var previous_track_index=songs.song_id;
      if(previous_track_index>2){
        previous_track_index-=1;
      }  
      else{
        previous_track_index=total_Track;
      }
      Music.findOne({song_id:previous_track_index},function(err,previous_song){
        if(err){
          res.json({
            'status':0,
            'error':'Error while changing song'
          });
        }
        else{
          res.json({
            'status':1,
            "previous_Song":previous_song
          })
        }
      })
    }
  });
});
module.exports = router;