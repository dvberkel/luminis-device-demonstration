/* global window:false, io:false */
(function (io) {
    'use strict';
    var socket = io.connect(window.location.origin);

    var Logger = function (destinationSocket) {
        this.destinationSocket = destinationSocket;
    };
    Logger.prototype.log = function (message) {
        this.destinationSocket.emit('log', { 'message': message });
    };

    var logger = new Logger(socket);

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
