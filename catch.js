var mysql  = require('mysql');
var song_s = require('./song_info.js');

var options = process.argv;
var s_start = +options[2];
var s_end = +options[3];
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'woshi123',
  database : 'xiami_db'
});
connection.connect();   
var song_id = s_start;
// var song = { id: '369559',title: 'ほんとの気持ち',artist: '松たか子',album: 'ほんとの気持ち',album_id: '31600',artist_id: '1111' };
console.log(song_s);
var insert_song = function(song){
    if((song != 0) && (song != 1)){
        var query = connection.query('INSERT INTO song SET ?', song, function(err, result) {
          // Neat!
        });
        console.log(query.sql);
    }
    if(s_start <= s_end){
        if(song_id < s_end){
            if(song != 1)
                song_id++;
            song_s(song_id,insert_song);
        }else{
            connection.end(); 
        }
    }else{
        if(song_id > s_end){
            if(song != 1)
                song_id--;
            song_s(song_id,insert_song);
        }else{
            connection.end(); 
        }
    }
}
// insert_song(song);
song_s(song_id,insert_song);    