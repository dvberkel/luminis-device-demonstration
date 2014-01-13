/* global window:false, io:false */
(function (io, undefined) {
    'use strict';

    var socket = io.connect(window.location.origin);
    socket.emit('presentation', {});
})(io);
