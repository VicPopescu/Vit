const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const fs = require('fs');
//
const root = __dirname;

/**
 *      Custom modules
 */
//profanity filter
const profanityFilter = require('../custom_modules/profanity_filter/profanity-filter.js');
//set static public folder
app.use(express.static(path.join(root, '../public')));
//test connection
io.on('connection', function (client) {
    client.emit('testConnection');
});


/**
 *      Server management functions
 */

//handling events for starting server
const startServer = function () {

    console.log("\n(SERVER): Vit Server started...");
    console.log("(SERVER): PID " + process.pid);
};

/**
 *      Server management binds
 */

//start server
server.listen(process.env.port || 4000, startServer);
