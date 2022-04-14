import $ from 'jquery';
window.$ = window.jquery = $;

/*$(function () {
	// Hilfsvariablen für HTML-Elemente werden mit Hilfe von JQuery gesetzt.
	var $window = $(window);
	  
	// Socket.io Objekt anlegen
	var socket = io();
	
	function sendSongText() {
		var test = $('#songIn').val();
		$('#songtext').html(test);
		
		socket.emit('new page', test);
	}
	
	document.getElementById('songButton').addEventListener('click', sendSongText);

	function setSongText(data) {
		$('#songtext').html(data.message);
	}

	// Server schickt "new page": Neuen Liedtext anzeigen
	socket.on('new page', function (data) {
		setSongText(data);
	});
});*/

$(document).ready(() => {
	const wsUrl = 'ws://127.0.0.1:3030';
	const ws = new WebSocket(wsUrl);
	ws.onopen = () => {
		console.log('Connected to Websocket on ' + wsUrl);
	}

	function setSongtext(data) {
		data = JSON.parse(data);
		$('#output').html("");
		data.forEach(value => {
			value = value.replace('SongBeamer DEMO', '');
			$('#output').append(value);
		});
	}

	ws.onmessage = function (evt) {
		setSongtext(evt.data);
	}
});