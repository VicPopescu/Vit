const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    path: '/socket.io'
});
const path = require('path');
const fs = require('fs');
const sassMiddleware = require('node-sass-middleware');

app.set('port', process.env.PORT || 4400);

/**
 *      Custom modules
 */
//profanity filter
const ProfanityFilter = require('./custom_modules/profanity_filter/index.js');
//command handler
const CommandHandler = require('./custom_modules/command_handler/index.js');
//server logging
const Log = require('./custom_modules/custom_logging/index.js');
//users management
const Users = require('./custom_modules/users/index.js');
//Application History
const ApplicationHistory = require('./custom_modules/history/index.js');





/**
 *      Variables
 */
//var port = process.env.PORT || 4400;
var room = { //default room to join //TO BE
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
    dest: path.join(__dirname, 'public/css/compiled'),
    debug: false,
    outputStyle: 'extended',
    prefix: '/css/compiled'
}));

//set static routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/chartjs', express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/views/activities', express.static(__dirname + '/server/views/activities/'));

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
 * 
 * @param {*} format 
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


/**
 * 
 * @param {*} actId 
 */
var get_ActivityViewById = function (actId) {

    switch (actId) {

        case 1:
            return "ticTacToe.html";
        case 2:
            return "example.html";
        default:
            break;
    };
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

/**
 * 
 * @param {*} user 
 */
var on_userRegister = function (user) {

    var client = this;

    user.type = user.type || 'user'; //TODO: dont let client chose use type

    Users.registerUser(user, function () {
        client.emit('register success', user);
    });
};

/**
 * 
 * @param {*} userDetails 
 */
var on_userLogin = function (userDetails) {

    var client = this;

    var user = {
        type: userDetails.type || 'user',
        user: userDetails.user,
        pass: userDetails.pass
    };

    //disconnect duplicate sockets
    for (var id in allUsers) {
        if (allUsers[id] === userDetails.user) {
            io.sockets.connected[id].disconnect();
            break;
        }
    }

    if (Users.findUser(user)) {

        var userName = userDetails.user;
        var password = userDetails.pass;
        var role = userDetails.role || "user";


        client.username = userName;
        client.password = password;

        allClients[client.id] = client;
        allUsers[client.id] = userName;

        if (client.username) {

            console.log(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Joined!');
            Log.write(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Joined!');
        } else {

            console.log(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Joined!');
            Log.write(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Joined!');
        }

        client.broadcast.emit('a user logged in', {
            id: client.id,
            name: userName
        });

        client.emit('login success', {
            all: allUsers,
            offline: Users.getOfflineUsers(),
            thisUser: {
                user: userName,
                pass: password,
                role: role
            },
            history: ApplicationHistory.getMessageHistory()
        });
    } else {
        client.emit('login failed', {
            message: "Login failed!\n User not found! Please register before login!"
        });
    }
};

/**
 * 
 * @param {*} stateInfo 
 */
var on_disconnect = function (stateInfo) {

    console.log(stateInfo);

    var client = this;

    var id = client.id;

    if (client.username) {

        console.log(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Disconnected!');
        Log.write(get_date('date and hour') + ' (SERVER) [USER: ' + client.username + ']: ' + ' Disconnected!');
    } else {

        console.log(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Disconnected!');
        Log.write(get_date('date and hour') + ' (SERVER) [USER: unknown]: ' + ' Disconnected!');
    }

    delete allClients[id];
    delete allUsers[id];

    io.emit('a client disconnected', {
        id: client.id
    });
};

/**
 * 
 * @param {*} o 
 */
var on_userMessage = function (o) {

    var client = this;

    o.msg = o.msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    //profanity check and replace
    o.msg = ProfanityFilter.filterReplace(o.msg);
    //add full date in UTC format
    o.utcDate = new Date().toISOString();
    //saving messages history
    ApplicationHistory.logMessageHistory(null, o);
    //logs
    console.log('(CLIENT): [' + o.usr + ']: ' + o.msg);
    Log.write(get_date('date and hour') + ' (CLIENT): [' + o.usr + ']: ' + o.msg);
    //broadcast message to all users
    io.emit('new message', o);
};

/**
 * 
 * @param {*} cmd 
 */
var on_command = function (cmd) {

    var client = this;

    var clientId = client.id;
    var user = client.username;
    var cmd = cmd.cmd;

    CommandHandler.executeCommand({
        clientId: clientId,
        user: user,
        cmd: cmd
    });

    fs.readFile(__dirname + '/public/images/logo_1.png', function (err, file) {

        if (err) {
            console.log(err);
            return false;
        }

        client.emit('image', {
            buffer: file.toString('base64')
        });
        console.log('image file is initialized');
    });

    console.log('(COMMAND) [' + client.username + ']: ' + cmd.cmd);
};

/**
 * 
 * @param {*} file 
 */
var on_fileSend = function (file) {

    var client = this;

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
};

/**
 * 
 * @param {*} opponent 
 */
var on_activityChallenge = function (activityDetails) {

    var player1 = {
        id: this.id,
        name: this.username
    };

    activityDetails.player1 = player1;

    io.to(activityDetails.player2.id).emit('activity challenge', activityDetails);
};

/**
 * 
 * @param {*} opponentId 
 */
var on_activityAccepted = function (challengeDetails) {

    io.to(challengeDetails.player1.id).emit('activity accepted', challengeDetails);
};

/**
 * 
 * @param {*} opponentId 
 */
var on_activityDeclined = function (opponentId) {

    io.to(opponentId).emit('activity declined');
};

/**
 * 
 * @param {*} activityId 
 */
var get_activityPartialView = function (challengeDetails) {

    var client = this;
    var activityView = get_ActivityViewById(challengeDetails.activity.id);

    fs.readFile(__dirname + '/server/views/activities/' + activityView, 'utf8', function (err, html) {

        if (err) {
            console.log(err);
            return false;
        }

        client.emit('receive activity partial view', {
            partialView: html,
            challengeDetails: challengeDetails
        });
    });
};

/**
 * 
 * @param {*} details 
 */
var on_activityReady = function (challengeDetails) {

    io.to(challengeDetails.player1.id).emit('activity ready', challengeDetails);
    io.to(challengeDetails.player2.id).emit('activity ready', challengeDetails);
};
/**
 * 
 * @param {*} data 
 */
var on_playerMark = function (data) {

    if (this.id == data.player1) {
        data.mark = "X";
    } else {
        data.mark = "O";
    }

    io.to(data.player1).emit('player mark', data);
    io.to(data.player2).emit('player mark', data);
};

/**
 * 
 * @param {object} client 
 */
var handleClientConnection = function (client) {

    client.on('user register', on_userRegister);
    client.on('user login', on_userLogin);
    client.on('disconnect', on_disconnect);
    client.on('user message', on_userMessage);
    client.on('command', on_command);
    client.on('file send', on_fileSend);
    client.on('activity challenge', on_activityChallenge);
    client.on('activity accepted', on_activityAccepted);
    client.on('activity declined', on_activityDeclined);
    client.on('get activity partial view', get_activityPartialView);
    client.on('player mark', on_playerMark);
    client.on('activity ready', on_activityReady);
};


/**
 * 
 */
io.on('connection', handleClientConnection)


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