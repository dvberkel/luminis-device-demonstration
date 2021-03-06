/* global window:false, document:false, io:false, Observable:false */
(function (io, Observable, undefined) {
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

    var Id = function () {
        Observable.call(this);
        this.listeners = [];
        this.value = 'unknown id';
    };
    Id.prototype = new Observable();
    Id.prototype.addListener = function (callback) {
        this.listeners.push(callback);
    };
    Id.prototype.notify = function () {
        this.listeners.forEach(function (callback) {
            callback.call(this, this);
        }.bind(this));
    };
    Id.prototype.set = function (value) {
        this.value = value;
        this.notify();
    };
    Id.prototype.get = function () {
        return this.value;
    };
    Id.prototype.receive = function (data) {
        this.set(data.id);
    };

    var IdView = function (parent, model) {
        this.parent = parent;
        this.model = model;
        model.addListener(this.update.bind(this));
    };
    IdView.prototype.update = function () {
        var container = this.container();
        container.textContent = this.model.get();
    };
    IdView.prototype.container = function () {
        if (this._container === undefined) {
            var container = this._container = document.createElement('span');
            this.parent.appendChild(container);
        }
        return this._container;
    };

    var MotionEventHandlers = function () {
        this.handlers = [];
    };
    MotionEventHandlers.prototype.addHandler = function (handler) {
        this.handlers.push(handler);
    };
    MotionEventHandlers.prototype.handle = function (event) {
        var acceleration = event.acceleration;
        this.handlers.forEach(function (handler) {
            handler.call(handler, acceleration);
        });
    };

    var socket = io.connect(window.location.origin);
    var logger = new Logger(socket);

    var motionHandler = function (acceleration) {
        socket.emit('motion', {
            timestamp: (new Date()).getTime(),
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z
        });
    };
    var totalHandler = function (acceleration) {
        socket.emit('total', {
            timestamp: (new Date()).getTime(),
            total: Math.sqrt(
                Math.pow(acceleration.x, 2) +
                    Math.pow(acceleration.y, 2) +
                    Math.pow(acceleration.z, 2)
            )
        });
    };

    var id = new Id();
    new IdView(document.getElementsByTagName('body')[0], id);
    socket.on('id', id.receive.bind(id));

    var background = new BackgroundSetter(document.body);
    background.set('gray');

    logger.log('device is fired up');

    if (window.DeviceMotionEvent) {
        logger.log('DeviceMotion is enabled');
        background.set('green');
        var handlers = new MotionEventHandlers();
        handlers.addHandler(motionHandler);
        handlers.addHandler(totalHandler);
        window.addEventListener('devicemotion', handlers.handle.bind(handlers), false);
    } else {
        logger.log('DeviceMotion is disabled');
        background.set('red');
    }
})(io, Observable);
