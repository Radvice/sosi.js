if (!(typeof require=="undefined")) { /* we are running inside node.js */
    var _ = require("underscore");
    var proj4 = require("proj4");

	proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

    var window = window || {};
    window.SOSI = window.SOSI || {};
}
