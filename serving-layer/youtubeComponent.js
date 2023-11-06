const { resolve } = require('path');
const {get_request,post_request,post_request_for_youtube} = require('../http-manger/http-manger');
const {getPlayListName,getSongInfo} = require('./spotifyComponent');
require('dotenv').config();
let session = {};
let playListId ;
const querystring = require('querystring');

const login = (req)=>{
    return new Promise((resolve,reject)=>{
        var client_id = process.env.youtube_clientId;
        var redirect_uri = process.env.youtube_redirectUri;

        const body={
            response_type : 'code',
            client_id : client_id,
            redirect_uri: redirect_uri,
            prompt:'consent',
            access_type:'offline',
            scope: [
                "https://www.googleapis.com/auth/youtube",
            ].join(" "),
        };
        resolve(process.env.youtube_authUrl +'?'+
        querystring.stringify(body));
    })
}

const callback = (req)=>{
    return new Promise((resolve,reject)=>{
       
        var code = req.query.code || null;
        if(req.query.code){
            const auth_body = {
                code: code,
                redirect_uri : process.env.youtube_redirectUri,
                client_id : process.env.youtube_clientId,
                client_secret : process.env.youtube_clientSecret,
                grant_type: "authorization_code",
            }
            const headers = {
                'content-type': 'application/x-www-form-urlencoded'
            }
            post_request(process.env.youtube_tokenUrl,auth_body,headers).then(response=>{
                session = {
                    access_token : response.access_token,
                    refresh_token : response.refresh_token,
                    experies_at : new Date() + response.experies_in,
                    id_token: response.id_token
                }
                console.log(session);
                const playListName = getPlayListName() || "testing for playlist transformation";
                console.log(playListName);
                const url = '/youtube/create-playlist?q='+playListName;
                resolve(url);
            })
        }
    })
}

const getPlayLists = (req)=>{
    return new Promise((resolve,reject)=>{
        const headers = {Authorization: `Bearer ${session.access_token}`};
        const query = {
            part:"snippet",
            mine:"true"
        }
        const url = process.env.youtube_baseUrl+"/playlists?"+querystring.stringify(query);
        get_request(url,headers).then(response=>{
            resolve(response);
        })
    })
}

const creatPlayList = (req)=>{
    return new Promise((resolve,reject)=>{
        const playListName = getPlayListName();
        const songInfo = getSongInfo();
        const headers = {
            Authorization: `Bearer ${session.access_token}`
        };
        
        const snippet={
            title: req.query.q,
            description: "Rakshith is legend"
        }
        const body = {
            snippet
        }
        const query = {
            part:"snippet",
            mine:true
        }
        let url = process.env.youtube_baseUrl+"/playlists?"+querystring.stringify(query);
        console.log(url+"url for creating playlist");
        post_request_for_youtube(url, body, headers).then(response=>{
            playListId = response.id;
            console.log(playListId+"playList ID");
            const songNames = getSongInfo();
            console.log(songInfo);
            songNames.forEach(element=>{
                // const search_url = 'http://localhost:5000/youtube/search?q='+element;
                const songInfo = {
                    query:{
                        q:element
                    }
                }
                searchSong(songInfo).then(result=>{
                    const videoId = result.items[0].id.videoId;
                    console.log(videoId);
                    const playListInfo = {
                        query:{
                            playlistId:playListId,
                            videoId
                        }
                    }
                    addToPlayList(playListInfo).then(addPlayListResponse=>{
                        // console.log(addPlayListResponse);
                    }).catch(error=>{
                        console.log(error);
                    });
                }).catch(error=>{
                    console.log(error);
                });
            })
            resolve(response);
        }).catch(error=>{
            reject(error);
        })
        
    })
}

const searchSong = (req)=>{
    const songName = req.query.q;
    console.log(songName+"songName");
    return new Promise((resolve,reject)=>{
        const headers = {
            Authorization: `Bearer ${session.access_token}`
        };
        const query = {
            part:"snippet",
            type:"video",
            key:process.env.youtube_apiKey,
            q:songName
        }
        const url = process.env.youtube_baseUrl+"/search?"+querystring.stringify(query);
        console.log(url);
        get_request(url,headers).then(response=>{
            console.log(response);
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

const addToPlayList = (req)=>{
    const playlistId = req.query.playlistId;
    const videoId = req.query.videoId;
    return new Promise((resolve,reject)=>{
        const headers = {
            Authorization: `Bearer ${session.access_token}`
        };

        const query = {
            part:"snippet,id,contentDetails,status",
            key:process.env.youtube_apiKey
        }

        const snippet={
            playlistId:playlistId,
            resourceId:{
                kind:"youtube#video",
                videoId:videoId
            }
        }
        const body = {
            snippet
        }
        const url = process.env.youtube_baseUrl+"/playlistItems?"+querystring.stringify(query);
        post_request_for_youtube(url,body,headers).then(response=>{
            resolve(response);
        }).catch(error=>{
            resolve(false);
        })
    })
}

module.exports={
    login,
    callback,
    getPlayLists,
    searchSong,
    creatPlayList,
    addToPlayList
}