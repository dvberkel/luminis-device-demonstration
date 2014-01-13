/* global window:false, io:false */
(function (io) {
    'use strict';
    var socket = io.connect(window.location.origin);
    socket.emit('test', {});
})(io);
