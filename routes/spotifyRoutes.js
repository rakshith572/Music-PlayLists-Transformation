const express=require('express');
const routes = express.Router();
const spotify=require('../controller/spotifyController');

routes.route('/login').get(spotify.loginControll);
routes.route('/callback').get(spotify.callbackControll);
routes.route('/playlists').get(spotify.getPlayListsControll);
routes.route('/playlist/songs').get(spotify.getSongsFromPlayListControll)

module.exports=routes;