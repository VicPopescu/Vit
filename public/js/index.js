const address = 'http://localhost:4000';
const socket = io.connect(address);

socket.on('testConnection', function () {
    alert("Connected");
});