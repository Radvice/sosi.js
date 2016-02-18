'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../src/sosi');
var Polygon = require('../src/geometry/Polygon');
var fs = require('fs');

describe('Flate', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/flatetest.sos', 'utf8');
    });

    it(' be able to read attributes', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.getById(651);
        assert.equals(feature1.attributes.objekttypenavn, 'Tank');

        assert.equals(feature1.attributes.kvalitet.målemetode, 82);
        assert.equals(feature1.attributes.registreringsversjon.versjon, '3.4 eller eldre');
    });

    it(' get center point', function () {
        var sosidata = parser.parse(data);
        var flate = sosidata.features.getById(651);
        var center = flate.geometry.center;
        assert(center);
        assert.equals(center.x, 341822.16);
        assert.equals(center.y, 7661351.84);
    });

    it(' be able to read geometry', function () {
        var sosidata = parser.parse(data);
        var flate = sosidata.features.getById(651);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 9);

        assert.equals(flate.geometry.flate[0].x, 341824.03);
        assert.equals(flate.geometry.flate[0].y, 7661347.45);

        assert.equals(flate.geometry.flate[1].x, 341817.18);
        assert.equals(flate.geometry.flate[1].y, 7661352.50);

        assert.equals(flate.geometry.flate[2].x, 341817.16);
        assert.equals(flate.geometry.flate[2].y, 7661352.49);

        assert.equals(flate.geometry.flate[3].x, 341817.23);
        assert.equals(flate.geometry.flate[3].y, 7661353.33);

        assert.equals(flate.geometry.flate[4].x, 341820.91);
        assert.equals(flate.geometry.flate[4].y, 7661356.85);

        assert.equals(flate.geometry.flate[5].x, 341826.38);
        assert.equals(flate.geometry.flate[5].y, 7661351.01);

        assert.equals(flate.geometry.flate[6].x, 341826.90);
        assert.equals(flate.geometry.flate[6].y, 7661350.95);

        assert.equals(flate.geometry.flate[7].x, 341826.78);
        assert.equals(flate.geometry.flate[7].y, 7661350.28);

        assert.equals(flate.geometry.flate[8].x, 341824.03);
        assert.equals(flate.geometry.flate[8].y, 7661347.45);
    });

    it(' be able to write to geoJSON', function () {
        var sosidata = parser.parse(data);
        var json =  sosidata.dumps('geojson');
        assert(json);

        assert.equals(json.type, 'FeatureCollection');
        assert.equals(json.features.length, 5);

        var feature1 = json.features[4];

        assert.equals(feature1.type, 'Feature');
        assert.equals(feature1.id, 651);
        assert.equals(feature1.properties.objekttypenavn, 'Tank');
        assert.equals(feature1.properties.datafangstdato, new Date(2003, 6, 2));
        assert.equals(feature1.properties.kvalitet.målemetode, 82);


        var geom = feature1.geometry;
        assert.equals(geom.type, 'Polygon');
        assert.equals(geom.coordinates[0].length, 9);

        assert.equals(geom.coordinates[0][0][0], 341824.03);
        assert.equals(geom.coordinates[0][0][1], 7661347.45);
        assert.equals(geom.coordinates[0][8][0], 341824.03);
        assert.equals(geom.coordinates[0][8][1], 7661347.45);

    });

    it(' be able to write to TopoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);

        assert.equals(json.type, 'Topology');
        assert.equals(json.objects[name].type, 'GeometryCollection');

        assert.equals(json.objects[name].geometries.length, 5);

        var geom4 = _.find(json.objects[name].geometries, function (x) {
            return x.properties.id === 651;
        });

        assert.equals(geom4.type, 'Polygon');

        assert.equals(geom4.properties.id, 651);
        assert.equals(geom4.properties.objekttypenavn, 'Tank');
        assert.equals(geom4.properties.datafangstdato, new Date(2003, 6, 2));
        assert.equals(geom4.properties.kvalitet.målemetode, 82);

        assert.equals(geom4.arcs.length, 1);
        assert.equals(geom4.arcs[0].length, 4);

        /*var shell = geom4.arcs[0];
        assert.equals(shell[0], -1);
        assert.equals(shell[1],  1);
        assert.equals(shell[2], -3);
        assert.equals(shell[3], 3);*/

        assert(json.arcs);
        assert.equals(json.arcs.length, 4);
        /*assert.equals(json.arcs[0][0][0], 341817.16);
        assert.equals(json.arcs[0][0][1], 7661352.49);
        assert.equals(json.arcs[0][1][0], 341817.18);
        assert.equals(json.arcs[0][1][1], 7661352.50);
        assert.equals(json.arcs[0][2][0], 341824.03);
        assert.equals(json.arcs[0][2][1], 7661347.45);

        assert.equals(json.arcs[3][0][0], 341826.90);
        assert.equals(json.arcs[3][0][1], 7661350.95);
        assert.equals(json.arcs[3][1][0], 341826.78);
        assert.equals(json.arcs[3][1][1], 7661350.28);
        assert.equals(json.arcs[3][2][0], 341824.03);
        assert.equals(json.arcs[3][2][1], 7661347.45);*/
    });
});

