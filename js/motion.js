/*global window:true, document:false, Observable:false */
window.Motion = (function (Observable) {
    'use strict';
    var Motion = {};

    var Base = function () {
        Observable.call(this);
        this.id = '?';
    };
    Base.prototype = new Observable();
    Base.prototype.update = function (event) {
        for (var key in event) {
            this[key] = event[key];
        }
        this.notify();
    };

    var BaseMap = function (Base) {
        Observable.call(this);
        this.collection = {};
        this.Base = Base;
    };
    BaseMap.prototype = new Observable();
    BaseMap.prototype.update = function (id, event) {
        var isNew = false;
        if (! this.collection[id]) {
            this.collection[id] = new this.Base();
            isNew = true;
        }
        event.id = id;
        this.collection[id].update(event);
        if (isNew) {
            this.notify();
        }
        return this.collection[id];
    };

    var BaseView = function (model, parent) {
        this.model = model;
        this.parent = parent;
    };
    BaseView.prototype.container = function (aClass) {
        if (! this._container) {
            var container = this._container = document.createElement('div');
            if (aClass) {
                container.setAttribute('class', aClass);
            }
            this.parent.appendChild(container);
        }
        return this._container;
    };

    var BaseMapView = function (model, parent, View) {
        this.views = {};
        this.model = model;
        this.parent = parent;
        this.View = View;
    };
    BaseMapView.prototype.register = function () {
        this.model.addListener(this.update.bind(this));
    };
    BaseMapView.prototype.update = function () {
        for (var id in this.model.collection) {
            this.updateView(id);
        }
    };
    BaseMapView.prototype.updateView = function (id) {
        if (! this.views[id]) {
            this.views[id] = new (this.View)(this.model.collection[id], this.container());
        }
    };
    BaseMapView.prototype.container = function () {
        return this.parent;
    };

    var standardFormatter = function (value) { return value; };

    var AttributeView = Motion.AttributeView = function (model, attribute, parent, formatter) {
        this.model = model;
        this.attribute = attribute;
        this.parent = parent;
        this.formatter = formatter || standardFormatter;
        this.model.addListener(this.update.bind(this));
        this.update();
    };
    AttributeView.prototype.update = function () {
        var container = this.container();
        container.textContent = this.formatter(this.model[this.attribute]);
    };
    AttributeView.prototype.container = function () {
        if (! this._container) {
            var container = this._container = document.createElement('span');
            container.setAttribute('class', 'attribute');
            this.parent.appendChild(container);
        }
        return this._container;
    };

    var Data = Motion.Data = function () {
        Base.call(this);
        this.x = 0;
        this.y = 0;
        this.z = 0;
    };
    Data.prototype = new Base();

    var DataMap = Motion.DataMap = function () {
        BaseMap.call(this, Data);
    };
    DataMap.prototype = new BaseMap();

    var DataView = Motion.DataView = function (model, parent) {
        BaseView.call(this, model, parent);
        this.create();
    };
    DataView.prototype = new BaseView();
    DataView.prototype.create = function () {
        var container = this.container('motion');
        new AttributeView(this.model, 'id', container);
        new AttributeView(this.model, 'x', container, Motion.format.decimal(2));
        new AttributeView(this.model, 'y', container, Motion.format.decimal(2));
        new AttributeView(this.model, 'z', container, Motion.format.decimal(2));
    };

    var DataMapView = Motion.DataMapView = function (model, parent) {
        BaseMapView.call(this, model, parent, DataView);
        this.register();
        this.update();
    };
    DataMapView.prototype = new BaseMapView();

    var Total = Motion.Total = function () {
        Base.call(this);
        this.total = 0;
    };
    Total.prototype = new Base();

    var TotalMap = Motion.TotalMap = function () {
        BaseMap.call(this, Total);
    };
    TotalMap.prototype = new BaseMap();
    TotalMap.prototype.sum = function () {
        var sum = 0;
        for (var key in this.collection) {
            sum += this.collection[key].total;
        }
        return sum;
    };

    var TotalView = Motion.TotalView = function (model, parent) {
        BaseView.call(this, model, parent);
        this.create();
    };
    TotalView.prototype = new BaseView();
    TotalView.prototype.create = function () {
        var container = this.container('total');
        new AttributeView(this.model, 'id', container);
        new AttributeView(this.model, 'total', container, Motion.format.decimal(2));
    };

    var TotalMapView = Motion.TotalMapView = function (model, parent) {
        BaseMapView.call(this, model, parent, TotalView);
        this.register();
        this.update();
    };
    TotalMapView.prototype = new BaseMapView();

    var SumView = Motion.SumView = function (model, parent) {
        this.model = model;
        this.parent = parent;
        this.update();
    };
    SumView.prototype.update = function () {
        var container = this.container();
        container.textContent = this.model.sum();
    };
    SumView.prototype.container = function () {
        return this.parent;
    };

    Motion.format = {};
    Motion.format.standard = standardFormatter;
    Motion.format.decimal = function (decimals) {
        return function (value) {
            return Number(value).toFixed(decimals);
        };
    };

    return Motion;
})(Observable);
