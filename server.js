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
const profanityFilter = require('./custom_modules/profanity_filter/profanity-filter.js');

/**
 *      Variables
 */
var port = process.env.PORT || 4400;
var room = { //default room to join
    id: "1",
    name: "Default Room",
    listOfUsers: [],
    emittedMessages: []
};

/**
 *      Routing
 */
//sass middleware
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'server/sass'),
    dest: path.join(__dirname, 'public/css'),
    debug: false,
    outputStyle: 'compressed',
    prefix: '/css'
}));
//set static public folder
app.use(express.static(path.join(__dirname, 'public')));


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

    client.on('user message', function (o) {

        console.log('(CLIENT): [' + o.usr + ']: ' + o.msg);

        io.emit('new message', o);
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
server.listen(port, serverStatus);