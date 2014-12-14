var io = require('socket.io-client');
var Convert = require('ansi-to-html')
var ajax = require('component-ajax');
var escapeBash = require('./lib/escape-bash');
var convert = new Convert({newLine: true});
var terminalId = window.location.pathname.split('/')[1];
var socket = io('//' + window.location.host);

function format(text) {
	return convert.toHtml(escapeBash(text));
}

function roomReady(data) {
	var terminal = document.querySelector('.terminal');
	var prev = data.terminal;
    socket.emit('join-room', {id: terminalId});
	socket.on('terminal', function (data) {
		var current = format(data.terminal);
		if (current !== prev) {
			prev = current;
			terminal.innerHTML = current;
			terminal.scrollTop = terminal.scrollHeight;
		}
	});
}

function roomEmpy() {
	var terminal = document.querySelector('.terminal');
    var hint = document.querySelector('.hint');
    var clone = document.createElement('div');
    clone.classList.add('hint');
    terminal.parentNode.removeChild(terminal);
    clone.innerHTML = hint.innerHTML;
    if (terminalId) {
        clone.querySelector('[data-terminal-id]').innerHTML = '-r ' + terminalId;
    }
    document.body.appendChild(clone);
}

window.addEventListener('DOMContentLoaded', function () {
    ajax({
        type: 'get',
        url: '/api/terminals/' + terminalId,
        success: roomReady,
        error: roomEmpy
    });
});
