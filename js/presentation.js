/* global window:false, document:false, Reveal:false, io:false, Motion:false */
(function (Reveal, io, Motion, undefined) {
    'use strict';

    var motionDataMap = new Motion.DataMap();

    var motionDataMapView;
    Reveal.addEventListener('motion-events', function () {
        if (!motionDataMapView) {
            motionDataMapView = new Motion.DataMapView(motionDataMap, document.getElementById('motion-data'));
        }
        var link = document.getElementById('link');
        var url = window.location.origin + '/static/device.html';
        link.setAttribute('href', url);
        link.textContent = url;
    });

    var totalDataMap = new Motion.TotalMap();

    var totalDataMapView;
    Reveal.addEventListener('total-events', function () {
        if (!totalDataMapView) {
            totalDataMapView = new Motion.TotalMapView(totalDataMap, document.getElementById('total-data'));
        }
    });

    var sumView;
    Reveal.addEventListener('total-sum', function () {
        if (!sumView) {
            sumView = new Motion.SumView(totalDataMap, document.getElementById('total-sum'));
        }
    });

    var circleView;
    Reveal.addEventListener('goodbye', function () {
        if (!circleView) {
            circleView = new Motion.CircleView(totalDataMap, document.getElementById('circle'));
        }
    });

    var socket = io.connect(window.location.origin);
    socket.emit('presentation', {});

    socket.on('motion', function (event) {
        motionDataMap.update(event.id, event);
    });

    socket.on('total', function (event) {
        totalDataMap.update(event.id, event);
    });
})(Reveal, io, Motion);
