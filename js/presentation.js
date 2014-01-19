/* global window:false, document:false, Reveal:false, io:false, Motion:false */
(function (Reveal, io, Motion, undefined) {
    'use strict';

    var motionDataMap = new Motion.DataMap();
    motionDataMap.update('a', { x: 1, y: 0, z: 0 });

    var motionDataMapView;
    Reveal.addEventListener('motion-events', function () {
        if (!motionDataMapView) {
            motionDataMapView = new Motion.DataMapView(motionDataMap, document.getElementById('motion-data'));
        }
    });

    var socket = io.connect(window.location.origin);
    socket.emit('presentation', {});
})(Reveal, io, Motion);
