const express=require('express');
const routes = express.Router();
const youtube=require('../controller/youtubeController');

routes.route('/login').get(youtube.loginControll);
routes.route('/callback').get(youtube.callbackControll);
routes.route('/playlists').get(youtube.getPlayListsControll);
routes.route('/create-playlist').get(youtube.creatPlayListControll);
routes.route('/search').get(youtube.searchSongsControll);
routes.route('/add-to-playlist').get(youtube.addToPlayListControll);

module.exports=routes;