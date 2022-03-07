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
	/*var addedUser = false;
	socket.on('add user', function (username) {
		socket.username = username;
		addedUser = true;
		
		socket.emit('login');
		
		socket.broadcast.emit('user joined', socket.username);
	});

	socket.on('new message', function (data) {
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
	});*/
	/*
	socket.on('disconnect', function () {
		if(addedUser) {
			socket.broadcast.emit('user left', socket.username);
		}
	});*/
	socket.on('new page', function (data) {
		socket.broadcast.emit('new page', {
			message: data
		});
	});
});
