$(function () {
	// Hilfsvariablen für HTML-Elemente werden mit Hilfe von JQuery gesetzt.
	var $window = $(window);
	var $usernameInput = $('.usernameInput'); // Eingabefeld für Benutzername
	var $messages = $('.messages');           // Liste mit Chat-Nachrichten
	var $inputMessage = $('.inputMessage');   // Eingabefeld für Chat-Nachricht
	var $loginPage = $('.login.page');        // Login-Seite
	var $chatPage = $('.chat.page');          // Chat-Seite

	var username;                             // Aktueller Benutzername
	var connected = false;                    // Kennzeichen ob angemeldet
	  
	// Eingabefeld für Benutzername erhält den Fokus
	var $currentInput = $usernameInput.focus();
	  
	// Socket.io Objekt anlegen
	var socket = io();

	/*// Chat-Nachricht versenden
	function sendMessage() {
		// Nachricht aus Eingabefeld holen (ohne Leerzeichen am Anfang oder Ende).
		var message = $inputMessage.val().trim();

		// Prüfen, ob die Nachricht nicht leer ist und wir verbunden sind.
		if (message && connected) {
			// Eingabefeld auf leer setzen
			$inputMessage.val('');

			// Chat-Nachricht zum Chatprotokoll hinzufügen
			addChatMessage({ username: username, message: message });
				  
			// Server über neue Nachricht informieren. Der Server wird die Nachricht
			// an alle anderen Clients verteilen.
			socket.emit('new message', message);
		}
	}

	// Protokollnachricht zum Chat-Protokoll anfügen
	function log(message) {
		var $el = $('<li>').addClass('log').text(message);
		$messages.append($el);
	}

	// Chat-Nachricht zum Chat-Protokoll anfügen
	function addChatMessage(data) {
		var $usernameDiv = $('<span class="username"/>').text(data.username);
		var $messageBodyDiv = $('<span class="messageBody">').text(data.message);
		var $messageDiv = $('<li class="message"/>').append($usernameDiv, $messageBodyDiv);
		$messages.append($messageDiv);
	}*/

	// ==== Code für Socket.io Events

	// Server schickt "login": Anmeldung war erfolgreich
	/*socket.on('login', function (data) {
		connected = true;
		log("Willkommen beim Chat!");
	});
	
	// Server schickt "new message": Neue Nachricht zum Chat-Protokoll hinzufügen
	socket.on('new message', function (data) {
		addChatMessage(data);
	});

	// Server schickt "user joined": Neuen Benutzer im Chat-Protokoll anzeigen
		socket.on('user joined', function (data) {
		log(data + ' joined');
	});

	// Server schickt "user left": Benutzer, der gegangen ist, im Chat-Protokoll anzeigen
		socket.on('user left', function (data) {
		log(data + ' left');
	}); */
	
	function sendSongText() {
		var test = $('#songIn').val();
		console.log(test);
		
		socket.emit('new page', test);
	}
	
	//$('#songtext').click(sendSongText());
	
	document.getElementById('songButton').addEventListener('click', sendSongText);
	
	function setSongText(data) {
		$('#songtext').html(data.message);
	}
	
	// Server schickt "new page": Neuen Liedtext anzeigen
	socket.on('new page', function (data) {
		console.log("out"+data.message);
		setSongText(data);
	});
});
