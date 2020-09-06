jQuery(document).ready(function(){
    var vol=1;
    var duration=0;
    var currentTime=0;
    var play=true;
    var model;
    var song_directory,theme_directory,song_name;
    const video = document.querySelector('#video');
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext('2d');
    const modelParams = {
       flipHorizontal: true,   // flip e.g for video 
       imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
       maxNumBoxes: 20,        // maximum number of boxes to detect
       iouThreshold: 0.5,      // ioU threshold for non-max suppression
       scoreThreshold: 0.79,    // confidence threshold for predictions.
    }
    //hand detection
    navigator.mediaDevices=navigator.mediaDevices;
    handTrack.startVideo(video).then(status=>{
        if(status){
            navigator.getUserMedia({video:{
                     
            }},stream=>{video.srcObject=stream;setInterval(runDetection,1000);},err=>{console.log(err)});
        }
    })
    function runDetection(){
        model.detect(video)
        .then(predictions=>{
            // console.log(predictions);
         if(predictions[0].bbox[0]>400){
            //  console.log('right');
                nextTrack();
            }
            if(predictions[0].bbox[0]<100){
                // console.log('left');
                prevTrack();
            }
            if(150<predictions[0].bbox[0]&&predictions[0].bbox[0]<400){
                control_music();
            }
        })
    }
    handTrack.load(modelParams).then(lmodel=>{
        model=lmodel;
    })
    //close hand detection
    //song duration
    jQuery('audio#player').on('loadedmetadata',function(){
        duration = this.duration;
        var minutes = parseInt(this.duration / 60, 10);
        var seconds = parseInt(this.duration % 60);
        jQuery('#songduration').html(minutes+":"+seconds);
    });
    //song play section
    jQuery('p#songname').on('click',function(){
        //song directory
         song_directory = jQuery(this).next('.songdirectory').val();        
        jQuery('audio#player').attr('src',song_directory);
        //thumbnail directory
         theme_directory=jQuery(this).prev().attr('src');
        jQuery('#player_thumbnail').attr('src',theme_directory);
        //song name
         song_name = jQuery(this).html();
        jQuery('#player_songname').html(song_name);
        //play pause button
        jQuery('.plpau').html('<i id="play" class="fas fa-pause"></i>');   
        play=false;
    });
    //close song play section
    //play pause button
    jQuery('.plpau').on('click',function(){
        control_music();
        // if(play){
        //     jQuery('audio#player').trigger('play');
        //     jQuery(this).html('<i id="play" class="fas fa-pause"></i>');
        //     // console.log(duration);
        //     play=false;
        // }
        // else{
        //     jQuery('audio#player').trigger('pause');
        //     jQuery(this).html('<i id="play" class="fas fa-play">');
        //     // console.log(duration);
        //     play=true;
        // }
    });
    function control_music(){
        if(play){
            jQuery('audio#player').trigger('play');
            jQuery('.plpau').html('<i id="play" class="fas fa-pause"></i>');
            // console.log(duration);
            play=false;
        }
        else{
            jQuery('audio#player').trigger('pause');
            jQuery('.plpau').html('<i id="play" class="fas fa-play">');
            // console.log(duration);
            play=true;
        }
    }
    //close play pause button
    //volume section
    jQuery('#mute').on('click',function(){
        jQuery('audio#player').prop('volume',0);
        jQuery('#mute').html('<i class="fas fa-volume-off"></i>');
        jQuery('#progress').val('0');
    });
    jQuery('#progress').change(function(){
        var volume=jQuery('#progress').val();
        jQuery('audio#player').prop('volume',volume);
        jQuery('#mute').html('<i class="fas fa-volume-down"></i>');
        vol=volume;
    });
    jQuery('#full').on('click',function(){
        jQuery('audio#player').prop('volume',1);
        jQuery('#mute').html('<i class="fas fa-volume-down"></i>');
        jQuery('#progress').val('1');
    });
    //close volume section
    //next song 
    jQuery('#nextsong').on('click',function(){
        nextTrack(); 
    });
    //close next song
    function nextTrack(){
        var song_path = jQuery('audio#player').attr('src');
        jQuery.ajax({
        url:'/nextsong',
        type:'POST',
        data:{'song_Path':song_path},
        success:function(response){
            if(response.status==0){
                alert(response.error);
            }
            if(response.status==1){
                jQuery('audio#player').attr('autoplay',true);
                // //song directory
                jQuery('audio#player').attr('src',response.next_Song.directory);
                // //thumbnail directory
                jQuery('#player_thumbnail').attr('src',response.next_Song.thumbnail);
                // //song name
                jQuery('#player_songname').html(response.next_Song.name);
                // //play pause button
                jQuery('.plpau').html('<i id="play" class="fas fa-pause"></i>');   
                play=false; 
            }
            
        }
       });
    }
    //previous song 
    jQuery('#previoussong').on('click',function(){
        prevTrack();
    });
    function prevTrack(){
        var song_path = jQuery('audio#player').attr('src');
        jQuery.ajax({
        url:'/previoussong',
        type:'POST',
        data:{'song_Path':song_path},
        success:function(response){
            if(response.status==0){
                alert(response.error);
            }
            if(response.status==1){
                // //song directory
                jQuery('audio#player').attr('src',response.previous_Song.directory);
                // //thumbnail directory
                jQuery('#player_thumbnail').attr('src',response.previous_Song.thumbnail);
                // //song name
                jQuery('#player_songname').html(response.previous_Song.name);
                // //play pause button
                jQuery('.plpau').html('<i id="play" class="fas fa-pause"></i>');   
                play=false; 
            }      
        }
       });
    }
    //close previous song
    //
})