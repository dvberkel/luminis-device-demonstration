/* global window:false, document:false, Reveal:false, io:false, Motion:false */
(function (Reveal, io, Motion, undefined) {
    'use strict';

    var motionDataMap = new Motion.DataMap();

    var motionDataMapView;
    Reveal.addEventListener('motion-events', function () {
        if (!motionDataMapView) {
            motionDataMapView = new Motion.DataMapView(motionDataMap, document.getElementById('motion-data'));
        }
    });

    var socket = io.connect(window.location.origin);
    socket.emit('presentation', {});

    socket.on('motion', function (event) {
        motionDataMap.update(event.id, event);
    });
})(Reveal, io, Motion);
