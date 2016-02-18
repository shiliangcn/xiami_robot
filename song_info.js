var request = require('request');
var jsdom = require('jsdom');
var jquery = require('jquery');
var validator = require('validator');

module.exports = function(sid,callback_next){
    var song_info = {}
    console.log(callback_next);
    var catch_html = function(callback) {
        // console.log('1234');
        console.log(sid);
        request('http://www.xiami.com/song/' + sid, function (error, response, body) {
            try{    
                console.log(response.statusCode);
                if (!error && response.statusCode == 200) {
                    // console.log(body);
                    callback(body);
                }else{
                    callback(0);
                }
            }catch(e){
                callback(1);
            }
         })
    };  

    var catch_info = function(hhtml){
        // console.log(hhtml);
        if(hhtml == 0){
            callback_next(0);
        }else if(hhtml == 1){
            callback_next(1);
        }else{
            jsdom.env(
                hhtml,
                function (errors, window) {
                    song_info.id = sid;
                    song_info.title = jquery(window)("meta[property='og:title']").attr('content');
                    if(jquery(window)('a[href*="http://www.xiami.com/search/find?artist"]').attr('title').length)
                        song_info.artist = jquery(window)('a[href*="http://www.xiami.com/search/find?artist"]').attr('title');
                    else
                        song_info.artist = jquery(window)("meta[property='og:music:artist']").attr('content');
                    song_info.album = jquery(window)("meta[property='og:music:album']").attr('content');
                    if(jquery(window)("#pub_notice").html() != null){
                        if(jquery(window)("#pub_notice").html().match('所属专辑未发布'))
                            song_info.unpublished = 1;
                    };
                    var album_h = jquery(window)(".CDcover185").attr('href');
                    var album_h_s = album_h.split('/')
                    song_info.album_id = album_h_s[album_h_s.length - 1]
                    var artist_h = jquery(window)('#nav').children().eq(0).attr('href');
                    try{
                        var artist_h_s = artist_h.split('/');
                    }catch(e){
                        window.close();
                        callback_next(1);
                        return;
                    }
                    if (validator.isNumeric(artist_h_s[artist_h_s.length - 1]))
                        song_info.artist_id = artist_h_s[artist_h_s.length - 1];
                    else{
                        artist_h = jquery(window)("meta[property='og:image']").attr('content');
                        try{
                            var artist_h_s = artist_h.split('/');
                        }catch(e){
                            window.close();
                            callback_next(1);
                            return;
                        }
                        song_info.artist_id = artist_h_s[artist_h_s.length - 2];
                    }
                    console.log(song_info);
                    window.close();
                    callback_next(song_info);
                }
            );
        }
    }
    catch_html(catch_info)
}