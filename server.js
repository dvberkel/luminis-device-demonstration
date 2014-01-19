var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('PORT', process.env.PORT || 1729);

app.use('/static', express.static(__dirname + '/dist'));

var presentations = {};

io.sockets.on('connection', function(socket){
    console.log('socket %s connected', socket.id);
    socket.emit('id', { 'id': socket.id });

    socket.on('presentation', function(){
	console.log('presentation');
	presentations[socket.id] = socket;
    });

    socket.on('log', function(data){
	console.log(data.message);
    })

    socket.on('motion', function(event){
	event.id = socket.id;
	for (var id in presentations) {
            console.log(event);

	    presentations[id].emit('motion', event);
	}
    });

    socket.on('total', function(event){
	event.id = socket.id;
	for (var id in presentations) {
            console.log(event);

	    presentations[id].emit('total', event);
	}
    });
});

server.listen(app.get('PORT'));
console.log('listening on port %s', app.get('PORT'));
