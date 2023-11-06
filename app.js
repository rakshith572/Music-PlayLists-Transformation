
const express = require('express');
const app = express();
const querystring = require('querystring');
const spotify = require('./routes/spotifyRoutes')
const youtube = require('./routes/youtubeRoutes');

app.use(express.static('./client'));
app.use('/spotify',spotify);
app.use('/youtube',youtube);

app.listen(5000,console.log('server listening at port 5000'));