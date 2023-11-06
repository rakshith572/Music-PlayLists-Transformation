require('dotenv').config();
const querystring = require('querystring');
const { login ,
        callback,
        getPlayLists,
        creatPlayList,
        searchSong,
        addToPlayList
    } = require('../serving-layer/youtubeComponent');
const { response } = require('express');

const loginControll=((req,res)=>{
    login(req).then(url=>{
        res.redirect(url);
    });
});

const callbackControll = ((req,res)=>{
    if(req.query.error){
        const errorMessage = {
            "error": req.query.error
        };
        res.send(JSON.stringify(errorMessage));
    }
    callback(req).then(response=>{
        res.redirect(response);
    })
})

const getPlayListsControll = ((req,res)=>{
    if(req.query.error){
        const errorMessage = {
            "error": req.query.error
        };
        console.log('errorrrrr');
        res.send(JSON.stringify(errorMessage));
    }
    getPlayLists(req).then(response=>{
        res.json(response);
    })
})

const creatPlayListControll=((req,res)=>{
    creatPlayList(req).then(response=>{
        res.json(response);
    })
})

const searchSongsControll = ((req,res)=>{
    searchSong(req).then(response=>{
        res.json(response);
    }).catch(error=>{
        res.json(error);
    })
})

const addToPlayListControll = ((req,res)=>{
    addToPlayList(req).then(response=>{
        res.json(response)
    }).catch(error=>{
        res.json(error);
    })
})

module.exports={
    loginControll,
    callbackControll,
    getPlayListsControll,
    creatPlayListControll,
    searchSongsControll,
    addToPlayListControll
}