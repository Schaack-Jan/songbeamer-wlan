$(function () {
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
});
