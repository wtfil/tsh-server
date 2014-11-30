#!/usr/bin/env node --harmony

var app = require('koa')();
var router = require('koa-router');
var fs = require('fs');
var serve = require('koa-static');
var browserify = require('koa-browserify');
var terminals = {};
var http = require('http');
var server, io;

app.use(browserify('./public'));
app.use(serve('./public'));
app.use(router(app));

server = http.Server(app.callback());
io = require('socket.io')(server);

app.get('/:id', function* () {
	this.type = 'text/html';
	this.body = fs.createReadStream('./public/index.html');
});
app.post('/rooms/:id', parseBody, function* (next) {
	var changes = saveTerminal(this.params.id, this.request.body.toString());
	if (changes) {
		sendTerminal(this.params.id);
	}
});


io.on('connection', function (socket) {
	socket.on('join-room', function (data) {
		socket.join(data.id);
		socket.emit('terminal', {terminal: terminals[data.id]});
	});
});

server.listen(Number(process.env.PORT || 4444));
console.log('server started on %s port', process.env.PORT || 4444);

function* parseBody(next) {
	var chunks = [];

	this.req.on('data', chunks.push.bind(chunks));

	yield function (cb) {
		this.req.on('end', function () {
			this.request.body = Buffer.concat(chunks);
			cb()
		}.bind(this));
	};
	yield next;
}

function saveTerminal(id, data) {
	var prev = terminals[id];
	terminals[id] = data;
	return data !== prev;
}

function sendTerminal(id) {
	io.to(id).emit('terminal', {terminal: terminals[id]});
}
