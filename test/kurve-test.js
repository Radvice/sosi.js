'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../index');
var LineString = require('../src/geometry/LineString');
var fs = require('fs');

describe('Kurve', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/kurvetest.sos', 'utf8');
    });


    it('should be able to read id', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.at(0);
        assert(feature1);
        assert.equals(feature1.id, 250);
    });


    it('should be able to read attributes', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.at(0);
        assert.equals(feature1.attributes.objekttypenavn, 'EiendomsGrense');


        assert.equals(feature1.attributes.kvalitet.målemetode, 40);
        assert.equals(feature1.attributes.kvalitet.nøyaktighet, 58);

    });

    it('should be able to read geometry', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.at(0);
        assert(feature1.geometry instanceof LineString);
        var kurve = feature1.geometry.kurve;
        assert.equals(kurve.length, 10);
        assert.equals(kurve[0].x, 10023.45);
        assert.equals(kurve[0].y, 100234.56);
        assert.equals(kurve[1].x, 10023.45);
        assert.equals(kurve[1].y, 100234.60);
        assert.equals(kurve[2].x, 10023.46);
        assert.equals(kurve[2].y, 100234.70);
        assert.equals(kurve[3].x, 10023.47);
        assert.equals(kurve[3].y, 100234.80);
        assert.equals(kurve[4].x, 10023.50);
        assert.equals(kurve[4].y, 100234.90);
        assert.equals(kurve[5].x, 10023.66);
        assert.equals(kurve[5].y, 100235.00);
        assert.equals(kurve[6].x, 10023.45);
        assert.equals(kurve[6].y, 100235.12);
        assert.equals(kurve[7].x, 10023.70);
        assert.equals(kurve[7].y, 100235.65);
        assert.equals(kurve[8].x, 10023.56);
        assert.equals(kurve[8].y, 100234.60);
        assert.equals(kurve[9].x, 10023.50);
        assert.equals(kurve[9].y, 100235.00);
    });

    it('should be able to read knutepunkter', function () {
        var sosidata = parser.parse(data);
        var feature1 = sosidata.features.at(0);

        var knutepunkter = feature1.geometry.knutepunkter;
        assert.equals(knutepunkter.length, 1);

        assert.equals(knutepunkter[0].knutepunktkode, 1);
        assert.equals(knutepunkter[0].x, 10023.56);
        assert.equals(knutepunkter[0].y, 100234.60);
    });

    it('should be able to write to geoJSON', function () {
        var sosidata = parser.parse(data);
        var json =  sosidata.dumps('geojson');
        assert(json);

        assert.equals(json.type, 'FeatureCollection');
        assert.equals(json.features.length, 1);

        var feature1 = json.features[0];

        assert.equals(feature1.type, 'Feature');
        assert.equals(feature1.id, 250);
        assert.equals(feature1.properties.kvalitet.målemetode, 40);
        assert.equals(feature1.properties.kvalitet.nøyaktighet, 58);

        var geom = feature1.geometry;
        assert.equals(geom.type, 'LineString');
        assert.equals(geom.coordinates.length, 10);

        assert.equals(geom.coordinates[0][0], 10023.45);
        assert.equals(geom.coordinates[0][1], 100234.56);
        assert.equals(geom.coordinates[9][0], 10023.50);
        assert.equals(geom.coordinates[9][1], 100235.00);

    });

    it('should be able to write to TopoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);

        assert.equals(json.type, 'Topology');
        assert.equals(json.objects[name].type, 'GeometryCollection');

        assert.equals(json.objects[name].geometries.length, 1);

        var geom1 = json.objects[name].geometries[0];

        assert.equals(geom1.type, 'LineString');

        assert.equals(geom1.properties.id, 250);
        assert.equals(geom1.properties.kvalitet.målemetode, 40);
        assert.equals(geom1.properties.kvalitet.nøyaktighet, 58);

        assert.equals(geom1.arcs.length, 1);
        assert.equals(geom1.arcs[0], 0);

        assert(json.arcs);
        assert.equals(json.arcs.length, 1);
        assert.equals(json.arcs[0][0][0], 10023.45);
        assert.equals(json.arcs[0][0][1], 100234.56);
        assert.equals(json.arcs[0][9][0], 10023.50);
        assert.equals(json.arcs[0][9][1], 100235.00);
    });
});

