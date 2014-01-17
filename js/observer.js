/*global window:true */
window.Observable = (function () {
    'use strict';

    var Observable = function () {
        this.listeners = [];
    };
    Observable.prototype.addListener = function (callback) {
        this.listeners.push(callback);
    };
    Observable.prototype.notify = function () {
        this.listeners.forEach(function (callback) {
            callback.call(this, this);
        }.bind(this));
    };

    return Observable;
})();
