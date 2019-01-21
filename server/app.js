let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();

/*
* Import required modules
* */
let serverConfig = require('./config');
let userRoutes = require('./routes/user');
let directoryRoutes = require('./routes/directory');
let fileRoutes = require('./routes/file');
let sharedDirectoryRoutes = require('./routes/sharedDirectory');
let sharedFileRoutes = require('./routes/sharedFile');
let activityRoutes = require('./routes/activity');
let groupRoutes = require('./routes/group');
let groupFileRoutes = require('./routes/groupFile');

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join('public')));
app.use('/user', userRoutes);
app.use('/directory', directoryRoutes);
app.use('/file', fileRoutes);
app.use('/sharedDirectory', sharedDirectoryRoutes);
app.use('/sharedFile', sharedFileRoutes);
app.use('/activity', activityRoutes);
app.use('/group', groupRoutes);
app.use('/groupFile', groupFileRoutes);

app.use('/', function (req, res, next) {
  return res.sendFile(path.join('public', 'index.html'));
});

app.use(function (req, res, next) {
  return res.sendFile(path.join('public', 'index.html'));
});

app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`dropbox-prototype is running on port: ${serverConfig.port}!`); // eslint-disable-line
  }
});

module.exports = app;
