const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, '../public')));

server.listen(process.env.port || 4000, function () {
    console.log('listening on *:4000');
});

io.on('connection', function (client) {
    client.emit('testConnection');
});