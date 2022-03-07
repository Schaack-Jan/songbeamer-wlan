var express = require('express');
var app = express();
var server = require('http').createServer(app);


var io = require('socket.io')(server);

var port = process.env.PORT || 80;
server.listen(port, function () {
	console.log('Webserver läuft auf Port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	socket.on('new page', function (data) {
		socket.broadcast.emit('new page', {
			message: data
		});
	});
});
