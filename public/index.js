var io = require('socket.io-client');
var Convert = require('ansi-to-html')
var convert = new Convert({newLine: true});
var terminalId = window.location.pathname.split('/')[1];
var socket = io('//' + window.location.host);

socket.emit('join-room', {id: terminalId});

function format(text) {
	return convert.toHtml(text);
}

window.addEventListener('DOMContentLoaded', function () {
	var terminal = document.querySelector('.terminal');
	var prev = '';
	socket.on('terminal', function (data) {
		var current = format(data.terminal);
		if (current.length !== prev.length) {
			if (current.length > prev.length) {
				terminal.innerHTML += current.slice(prev.length);
			} else {
				terminal.innerHTML = current;
			}
			prev = current;
			terminal.scrollTop = terminal.scrollHeight;
		}
	});
});
