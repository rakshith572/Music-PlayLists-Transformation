const {login,callback,getPlayLists,getSession, getSongsFromPlayList} = require('../serving-layer/spotifyComponent');;
const path = require('path');

const loginControll=((req,res)=>{
    login(req).then(url=>{
        res.redirect(url);
    });
});

const callbackControll=((req,res)=>{
    if(req.query.error){
        const errorMessage = {
            "error": req.query.error
        };
        res.send(JSON.stringify(errorMessage));
    }
    callback(req).then(url=>res.sendFile(path.join(__dirname,'../client/playList.html')));
});


const getPlayListsControll=((req,res)=>{
    const session = getSession();
    if(!session.access_token){
        res.redirect('/spotify/login');
    }
    if(new Date() > session.experies_at){
        app.redirect('/spotify/login');
    }
    getPlayLists(req).then(response=>{
        res.json(response);
    })
})
const getSongsFromPlayListControll=((req,res)=>{
    const id = req.query.id;
    const session = getSession();
    if(!session.access_token){
        res.redirect('/spotify/login');
    }
    if(new Date() > session.experies_at){
        app.redirect('/spotify/login');
    }
    getSongsFromPlayList(req).then(response=>{
        res.json(response);
    })
})
module.exports = {
    loginControll,
    callbackControll,
    getPlayListsControll,
    getSongsFromPlayListControll
}