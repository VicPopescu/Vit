const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    path: '/socket.io',
    //transports: ['websocket'],
    //upgrade: false
});
const path = require('path');
const fs = require('fs');
const sassMiddleware = require('node-sass-middleware');

app.set('port', process.env.PORT || 4400);

/**
 *      Custom modules
 */
//profanity filter
const profanityFilter = require('./custom_modules/profanity_filter/index.js');
//command handler
const commandHandler = require('./custom_modules/command_handler/index.js');
//server logging
const log = require('./custom_modules/custom_logging/index.js');
//user login
const login = require('./custom_modules/login/index.js');



/**
 *      Variables
 */
//var port = process.env.PORT || 4400;
var room = { //default room to join
    id: "1",
    name: "Default Room",
    listOfUsers: [],
    emittedMessages: []
};

var allClients = {};
var allUsers = {};

/**
 *      Routing
 */
//sass middleware
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'server/sass'),
    dest: path.join(__dirname, 'public/css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
//set static public folder
app.use(express.static(path.join(__dirname, 'public')));

/**
 *      Returns a random integer between min and max, if provided, or use default numbers
 */
function get_intRandom(min, max) {

    //default values, if min and max are not provided
    min = min || 0;
    max = max || 1000;

    return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 *      Get current date and time
 */
function get_date(format) {

    var date = new Date();

    var day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

    var h = date.getHours(),
        m = date.getMinutes();

    day < 10 ? day = '0' + day : day;
    month < 10 ? month = '0' + month : month;
    h < 10 ? h = '0' + h : h;
    m < 10 ? m = '0' + m : m;

    switch (format) {
        case 'hour':

            var time = h + 'h:' + m + 'm';
            break;

        case 'date':

            var time = day + '/' + month + '/' + year;
            break;
        case 'date and hour':

            var time = day + '/' + month + '/' + year + '  ' + h + 'h:' + m + 'm';
            break;

        default:
            break;
    }

    return time;
};


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

    /**
     * 
     */
    client.on('user register', function (user) {

        user.type = user.type || 'user';

        login.registerUser(user, function () {
            client.emit('register success', user);
        });
    });

    /**
     * 
     */
    client.on('user login', function (userDetails) {

        var user = {
            type: userDetails.type || 'user',
            user: userDetails.user,
            pass: userDetails.pass
        };

        if (login.findUser(user)) {

            var userName = userDetails.user;
            var password = userDetails.pass;

            client.username = userName;
            client.password = password;

            allClients[client.id] = client;
            allUsers[client.id] = userName;

            if (client.username) {

                console.log(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Joined!');
                log.write(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Joined!');
            } else {

                console.log(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Joined!');
                log.write(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Joined!');
            }

            client.broadcast.emit('a user logged in', {
                id: client.id,
                name: userName
            });

            client.emit('login success', {
                all: allUsers,
                thisUser: {
                    user: userName,
                    pass: password
                }
            });
        } else {
            client.emit('login failed', {
                message: "Login failed!\n User not found! Please register before login!"
            });
        }
    });

    /**
     * 
     */
    client.on('disconnect', function () {

        var id = client.id;

        if (client.username) {

            console.log(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Disconnected!');
            log.write(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Disconnected!');
        } else {

            console.log(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Disconnected!');
            log.write(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Disconnected!');
        }

        delete allClients[id];
        delete allUsers[id];

        io.emit('a client disconnected', {
            id: client.id
        });
    });

    /**
     * 
     */
    client.on('user message', function (o) {

        o.msg = profanityFilter.filterReplace(o.msg);

        console.log('(CLIENT): [' + o.usr + ']: ' + o.msg);
        log.write(get_date('date and hour') + ' (CLIENT): [' + o.usr + ']: ' + o.msg);

        io.emit('new message', o);
    });


    /**
     * 
     */
    client.on('command', function (cmd) {

        var id = client.id;

        fs.readFile(__dirname + '/public/images/logo_1.png', function (err, buf) {

            if (err) {
                console.log(err);
                return false;
            }

            client.emit('image', {
                buffer: buf.toString('base64')
            });
            console.log('image file is initialized');
        });

        console.log('(COMMAND) [' + client.username + ']: ' + cmd.cmd);
    });


    /**
     * 
     */
    client.on('file send', function (file) {

        //file description:
        //
        //name: 'file name',
        //size: '10',
        //type: 'text/plain',
        //data: 'data:text/plain;base64,dGVzdA=='

        io.emit('file broadcast all', {
            'user': client.username,
            'content': file
        });
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
server.listen(app.get('port'), serverStatus);