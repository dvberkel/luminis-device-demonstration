var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.set('PORT', process.env.PORT || 1729);

app.use('/static', express.static(__dirname + '/dist'));

server.listen(app.get('PORT'));
console.log('listening on port %s', app.get('PORT'));
