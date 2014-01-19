/*global window:true, document:false, Observable:false */
window.Motion = (function (Observable) {
    'use strict';
    var Motion = {};

    var Data = Motion.Data = function () {
        Observable.call(this);
        this.id = '?';
        this.x = 0;
        this.y = 0;
        this.z = 0;

    };
    Data.prototype = new Observable();
    Data.prototype.update = function (event) {
        this.id = event.id;
        this.x = event.x;
        this.y = event.y;
        this.z = event.z;
        this.notify();
    };

    var DataMap = Motion.DataMap = function () {
        Observable.call(this);
        this.collection = {};
    };
    DataMap.prototype = new Observable();
    DataMap.prototype.update = function (id, event) {
        var isNew = false;
        if (! this.collection[id]) {
            this.collection[id] = new Data();
            isNew = true;
        }
        event.id = id;
        this.collection[id].update(event);
        if (isNew) {
            this.notify();
        }
        return this.collection[id];
    };

    var AttributeView = Motion.AttributeView = function (model, attribute, parent) {
        this.model = model;
        this.attribute = attribute;
        this.parent = parent;
        this.model.addListener(this.update.bind(this));
        this.update();
    };
    AttributeView.prototype.update = function () {
        var container = this.container();
        container.textContent = this.model[this.attribute];
    };
    AttributeView.prototype.container = function () {
        if (! this._container) {
            this._container = document.createElement('span');
            this.parent.appendChild(this._container);
        }
        return this._container;
    };

    var DataView = Motion.DataView = function (model, parent) {
        this.model = model;
        this.parent = parent;
        this.create();
    };
    DataView.prototype.create = function () {
        var container = this.container();
        new AttributeView(this.model, 'id', container);
        new AttributeView(this.model, 'x', container);
        new AttributeView(this.model, 'y', container);
        new AttributeView(this.model, 'z', container);
    };
    DataView.prototype.container = function () {
        if (! this._container) {
            this._container = document.createElement('div');
            this.parent.appendChild(this._container);
        }
        return this._container;
    };

    var DataMapView = Motion.DataMapView = function (model, parent) {
        this.views = {};
        this.model = model;
        this.parent = parent;
        this.model.addListener(this.update.bind(this));
        this.update();
    };
    DataMapView.prototype.update = function () {
        for (var id in this.model.collection) {
            this.updateView(id);
        }
    };
    DataMapView.prototype.updateView = function (id) {
        if (! this.views[id]) {
            this.views[id] = new DataView(this.model.collection[id], this.container());
        }
    };
    DataMapView.prototype.container = function () {
        return this.parent;
    };

    return Motion;
})(Observable);
