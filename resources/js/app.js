'use strict';
import $ from 'jquery';
window.$ = window.jquery = $;

$(document).ready(() => {
	const socket = io();

	function setSongtext(data) {
		$('#output').html("");
		data.forEach(value => {
			value = value.replace('SongBeamer DEMO', '');
			$('#output').append(value);
		});
	}

	$.ajax({url: "/songtext", success: result => {
		setSongtext(result.songtext);
	}})

	socket.on('message', data => {
		setSongtext(data);
	});

});