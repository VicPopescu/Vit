const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const fs = require('fs');
const sassMiddleware = require('node-sass-middleware');

/**
 *      Custom modules
 */
//profanity filter
const profanityFilter = require('../custom_modules/profanity_filter/profanity-filter.js');
//sass middleware
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, '../public/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css'
}));
//set static public folder
app.use(express.static(path.join(__dirname, '../public')));
//test connection
io.on('connection', function (client) {
    client.emit('testConnection');
});


/**
 *      Server management functions
 */

//handling events for starting server
var serverStatus = function () {

    var port = server.address().port;

    console.log("\n(SERVER): Vit Server started...");
    console.log("(SERVER): PID " + process.pid);
    console.log("(SERVER): PORT " + port);
};

/**
 *      Server management binds
 */

//start server
server.listen(process.env.port || 4000, serverStatus);
