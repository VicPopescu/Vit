var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var fs = require('fs');
var sassMiddleware = require('node-sass-middleware');

/**
 *      Custom modules
 */
//profanity filter
var profanityFilter = require('../custom_modules/profanity_filter/profanity-filter.js');

/**
 *      Routes
 */
//sass middleware
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, '../public/css'),
    debug: false,
    outputStyle: 'compressed',
    prefix: '/css'
}));
//set static public folder
app.use(express.static(path.join(__dirname, '../public')));


// // sending to sender-client only
// socket.emit('message', "test message");

// // sending to all clients, include sender
// io.emit('message', "another test message");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this realy is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'ubabuba');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'amazing potato');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'ghita FTW');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'painful potato');

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'now you see me!');


//test connection
io.on('connection', function (client) {
    client.on('chat message', function (msg) {
        console.log('(ANY CLIENT): ' + msg);
        io.emit('new message', msg);
    });
});


/**
 *      Server management functions
 */

//handling events for starting server
var serverStatus = function () {

    var port = server.address().port;

    console.log("\n(SERVER INFO): Vit started...");
    console.log("(SERVER INFO): PID " + process.pid);
    console.log("(SERVER INFO): PORT " + port);
    console.log("\n");
};

/**
 *      Server management binds
 */

//start server
server.listen(process.env.port || 4000, serverStatus);