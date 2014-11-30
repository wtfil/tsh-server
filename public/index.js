var io = require('socket.io-client');
var Convert = require('ansi-to-html')
var escapeBash = require('./escape-bash');
var convert = new Convert({newLine: true});
var terminalId = window.location.pathname.split('/')[1];
var socket = io('//' + window.location.host);

function format(text) {
	return convert.toHtml(escapeBash(text));
}

socket.emit('join-room', {id: terminalId});

window.addEventListener('DOMContentLoaded', function () {
	var terminal = document.querySelector('.terminal');
	var prev = '';
	socket.on('terminal', function (data) {
		var current = format(data.terminal);
		if (current !== prev) {
			terminal.innerHTML = current;
			prev = current;
			terminal.scrollTop = terminal.scrollHeight;
		}
	});
});
