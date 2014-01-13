/* global window:false, io:false */
(function (io) {
    'use strict';
    var socket = io.connect(window.location.origin);

    var logger = (function (destinationSocket) {
        return {
            log: function (message) { destinationSocket.emit('log', { 'message': message }); }
        };
    })(socket);

    logger.log('device is fired up');

    if (window.DeviceMotionEvent) {
        logger.log('DeviceMotion is enabled');
        window.addEventListener('devicemotion', function (event) {
            socket.emit('motion', {
                timestamp: (new Date()).getTime(),
                x: event.acceleration.x,
                y: event.acceleration.y,
                z: event.acceleration.z
            });
        }, false);
    } else {
        logger.log('DeviceMotion is disabled');
    }
})(io);
