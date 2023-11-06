const querystring = require('querystring');
let session = {};
let playListName ;
let songsInfo = [];

const {get_request,post_request} = require('../http-manger/http-manger');
require('dotenv').config();

const login = (req)=>{
    return new Promise((resolve,reject)=>{
        var scope = 'user-read-private user-read-email';
        var client_id = process.env.clientId;
        var redirect_uri = process.env.redirectUri;

        const body={
            response_type : 'code',
            client_id : client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            show_dialog: false
        }
        console.log(process.env.authUrl +'?'+
        querystring.stringify(body));
        resolve(process.env.authUrl +'?'+
        querystring.stringify(body));
    })
}

const callback = (req)=>{
    return new Promise((resolve,reject)=>{
       
        var code = req.query.code || null;
        if(req.query.code){
            const auth_body = {
                code: code,
                grant_type: 'authorization_code',
                redirect_uri : process.env.redirectUri,
                client_id : process.env.clientId,
                client_secret : process.env.clientSecret
            }
            const headers = {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(auth_body.client_id + ':' + auth_body.client_secret).toString('base64'))
            }
            post_request(process.env.tokenUrl,auth_body,headers).then(response=>{
                session = {
                    access_token : response.access_token,
                    refresh_token : response.refresh_token,
                    experies_at : new Date() + response.experies_in
                }
            
                resolve('/spotify/playlists');
            })
        }
    })
}

const getPlayLists = (req)=>{
    return new Promise((resolve,reject)=>{
        const headers = {Authorization: `Bearer ${session.access_token}`};
        const url = process.env.apiBaseUrl+"/me/playlists";
        get_request(url,headers).then(response=>{
            resolve(response);
        })
    })
}

const getSongsFromPlayList = (req)=>{
    playListName = req.query.name;
    return new Promise((resolve,reject)=>{
        const headers = {Authorization: `Bearer ${session.access_token}`};
        const url = process.env.apiBaseUrl+'/playlists/'+req.query.id;
        get_request(url,headers).then(response=>{
            const items = response.tracks.items;
            items.forEach(element => {
                const artistName = element.track.artists[0].name;
                const songName = element.track.name;
                // const songs = {
                //     artistName:artistName,
                //     songName:songName
                // }
                songsInfo.push(songName);
            });
            resolve(response);
        })
    })
}

const getSession = ()=>{
    return session;
}

const getPlayListName = ()=>{
    return playListName;
}

const getSongInfo = ()=>{
    return songsInfo;
}
module.exports={
    login,
    callback,
    getPlayLists ,
    getSession ,
    getSongsFromPlayList,
    getPlayListName,
    getSongInfo,
};