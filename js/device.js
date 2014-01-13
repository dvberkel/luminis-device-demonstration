/* global window:false, document:false, io:false */
(function (io) {
    'use strict';

    var Logger = function (destinationSocket) {
        this.destinationSocket = destinationSocket;
    };
    Logger.prototype.log = function (message) {
        this.destinationSocket.emit('log', { 'message': message });
    };

    var BackgroundSetter = function (element) {
        this.element = element;
    };
    BackgroundSetter.prototype.set = function (color) {
        this.element.style.background = color;
    };

    var socket = io.connect(window.location.origin);

    var logger = new Logger(socket);
    var background = new BackgroundSetter(document.body);
    background.set('gray');

    logger.log('device is fired up');

    if (window.DeviceMotionEvent) {
        logger.log('DeviceMotion is enabled');
        background.set('green');
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
        background.set('red');
    }
})(io);
