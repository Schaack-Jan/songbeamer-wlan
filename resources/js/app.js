'use strict';
import $ from 'jquery';
window.$ = window.jquery = $;

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
	document.documentElement.classList.add('dark');
} else {
	document.documentElement.classList.remove('dark')
}

$(document).ready(() => {
	const socket = io();

	function setSongtext(data) {
		$('#output').html("");
		data.forEach(value => {
			if (value.indexOf('SongBeamer DEMO') > -1) {
				return;
			}
			$('#output').append("<p class='py-2 md:py-1'>" + value + "</p>");
		});
	}

	$.ajax({url: "/songtext", success: result => {
		setSongtext(result.songtext);
	}})

	socket.on('message', data => {
		setSongtext(data);
	});


	const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
	const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

	if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		themeToggleLightIcon.classList.remove('hidden');
	} else {
		themeToggleDarkIcon.classList.remove('hidden');
	}

	const themeToggleBtn = $('#theme-toggle');
	const doc = $('html');

	themeToggleBtn.click(() => {
		themeToggleDarkIcon.classList.toggle('hidden');
		themeToggleLightIcon.classList.toggle('hidden');

		if (localStorage.getItem('color-theme')) {
			if (localStorage.getItem('color-theme') === 'light') {
				doc.addClass('dark');
				localStorage.setItem('color-theme', 'dark');
			} else {
				doc.removeClass('dark');
				localStorage.setItem('color-theme', 'light');
			}
		} else {
			if (doc.hasClass('dark')) {
				doc.removeClass('dark');
				localStorage.setItem('color-theme', 'light');
			} else {
				doc.addClass('dark');
				localStorage.setItem('color-theme', 'dark');
			}
		}
	});
});