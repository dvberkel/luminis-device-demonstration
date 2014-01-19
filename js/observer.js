/*global window:true */
window.Observable = (function (undefined) {
    'use strict';

    var Observable = function () {
        this.specific = {};
        this.general = [];
    };
    Observable.prototype.addListener = function (key, callback) {
        if (callback === undefined) {
            callback = key;
            this.general.push(callback);
        } else {
            this._listenersFor(key).push(callback);
        }
    };
    Observable.prototype.notify = function (key) {
        if (key === undefined) {
            this.general.forEach(function (callback) {
                callback.call(this, this);
            }.bind(this));
        } else {
            this._listenersFor(key).forEach(function (callback) {
                callback.call(this, this);
            }.bind(this));
        }
    };
    Observable.prototype._listenersFor = function (key) {
        if (!this.specific[key]) {
            this.specific[key] = [];
        }
        return this.specific[key];
    };

    return Observable;
})();
