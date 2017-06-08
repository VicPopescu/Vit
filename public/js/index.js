const address = 'http://localhost:4000';
const socket = io.connect(address);

var template_message = function (m) {
    m = '<li>' + m + '</li>';
    return m;
};

socket.on('connection', function () {
    //we need potato connection here
});

socket.on('new message', function (msg) {
    $('#chat__allMessages').append(template_message(msg));
});

$('#chat__form').submit(function (e) {

    var message = $('#chat__userInput').val();

    socket.emit('chat message', message);

    $('#chat__userInput').val('');

    e.preventDefault();
    return false;
});