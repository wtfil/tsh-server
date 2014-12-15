#!/usr/bin/env node --harmony

var app = require('koa')();
var router = require('koa-router');
var fs = require('fs');
var serve = require('koa-static');
var browserify = require('koa-browserify');
var bodyParser = require('koa-bodyparser');
var terminals = {};
var http = require('http');
var server, io;

function saveTerminal(id, data) {
	var prev = terminals[id];
	terminals[id] = data;
	return prev && data.terminal !== prev.terminal;
}

function sendTerminal(id) {
	if (terminals[id]) {
		io.to(id).emit('terminal', terminals[id]);
	}
}

app.use(bodyParser());
app.use(browserify('./public'));
app.use(serve('./public'));
app.use(router(app));

server = http.Server(app.callback());
io = require('socket.io')(server);

app.get('/:id', function* () {
	this.type = 'text/html';
	this.body = fs.createReadStream('./public/index.html');
});
app.post('/rooms/:id', function* (next) {
	var changes = saveTerminal(this.params.id, this.request.body);

	if (changes) {
		sendTerminal(this.params.id);
	}
});


io.on('connection', function (socket) {
	socket.on('join-room', function (data) {
		socket.join(data.id);
		sendTerminal(data.id);
	});
});

server.listen(Number(process.env.PORT || 4444));
console.log('server started on %s port', process.env.PORT || 4444);
