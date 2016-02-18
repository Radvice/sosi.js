'use strict';
/*eslint-env  mocha */

var _ = require('underscore');
var referee = require('referee');
var assert = referee.assert;
var refute = referee.refute;
var SOSI = require('../src/sosi');
var Polygon = require('../src/geometry/Polygon');
var fs = require('fs');

describe('Island', function () {
    var parser, 
        data;

    before(function () {
        parser = new SOSI.Parser();
        data = fs.readFileSync('./data/flate_oy.sos', 'utf8');
    });

    it('should read outer ring', function () {
        var sosidata = parser.parse(data);
        var flate = sosidata.features.getById(400);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 5);

        assert.equals(flate.geometry.flate[0].x, 300000);
        assert.equals(flate.geometry.flate[0].y, 7000000);

        assert.equals(flate.geometry.flate[1].x, 300000);
        assert.equals(flate.geometry.flate[1].y, 7001000);

        assert.equals(flate.geometry.flate[2].x, 301000);
        assert.equals(flate.geometry.flate[2].y, 7001000);

        assert.equals(flate.geometry.flate[3].x, 301000);
        assert.equals(flate.geometry.flate[3].y, 7000000);

        assert.equals(flate.geometry.flate[4].x, 300000);
        assert.equals(flate.geometry.flate[4].y, 7000000);
    });

    it('should read the ploygon that describes the inner ring', function () {
        var sosidata = parser.parse(data);
        var flate = sosidata.features.getById(500);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 5);

        assert.equals(flate.geometry.flate[0].x, 300010);
        assert.equals(flate.geometry.flate[0].y, 7000010);

        assert.equals(flate.geometry.flate[1].x, 300010);
        assert.equals(flate.geometry.flate[1].y, 7000020);

        assert.equals(flate.geometry.flate[2].x, 300020);
        assert.equals(flate.geometry.flate[2].y, 7000020);

        assert.equals(flate.geometry.flate[3].x, 300020);
        assert.equals(flate.geometry.flate[3].y, 7000010);

        assert.equals(flate.geometry.flate[4].x, 300010);
        assert.equals(flate.geometry.flate[4].y, 7000010);
    });

    it('should read island described as another FLATE', function () {
        var sosidata = parser.parse(data);
        var flate = sosidata.features.getById(400);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 5);
        assert.equals(flate.geometry.holes.length, 1);

        var island = flate.geometry.holes[0];
        assert.equals(island.length, 5);
        assert.equals(island[0].x, 300010);
        assert.equals(island[0].y, 7000010);

        assert.equals(island[1].x, 300010);
        assert.equals(island[1].y, 7000020);

        assert.equals(island[2].x, 300020);
        assert.equals(island[2].y, 7000020);

        assert.equals(island[3].x, 300020);
        assert.equals(island[3].y, 7000010);

        assert.equals(island[4].x, 300010);
        assert.equals(island[4].y, 7000010);
    });

    it('should read island described by KURVE', function () {
        var sosidata = parser.parse(data);
        var flate = sosidata.features.getById(600);
        assert(flate.geometry instanceof Polygon);

        assert.equals(flate.geometry.flate.length, 5);
        assert.equals(flate.geometry.holes.length, 1);

        var island = flate.geometry.holes[0];

        assert.equals(island.length, 5);
        assert.equals(island[0].x, 300010);
        assert.equals(island[0].y, 7000010);

        assert.equals(island[1].x, 300010);
        assert.equals(island[1].y, 7000020);

        assert.equals(island[2].x, 300020);
        assert.equals(island[2].y, 7000020);

        assert.equals(island[3].x, 300020);
        assert.equals(island[3].y, 7000010);

        assert.equals(island[4].x, 300010);
        assert.equals(island[4].y, 7000010);
    });

    it('should be able to write to geoJSON', function () {
        var sosidata = parser.parse(data);
        var json =  sosidata.dumps('geojson');
        assert(json);

        assert.equals(json.type, 'FeatureCollection');
        assert.equals(json.features.length, 11);

        var feature1 = json.features[10];

        assert.equals(feature1.type, 'Feature');
        assert.equals(feature1.id, 600);
        assert.equals(feature1.properties.objekttypenavn, 'Mahogney');

        assert.equals(feature1.properties.kvalitet.målemetode, 82);

        var geom = feature1.geometry;
        assert.equals(geom.type, 'Polygon');
        assert.equals(geom.coordinates.length, 2);

        assert.equals(geom.coordinates[0].length, 5);
        assert.equals(geom.coordinates[1].length, 5);

        assert.equals(geom.coordinates[0][0][0], 300000);
        assert.equals(geom.coordinates[0][0][1], 7000000);

        assert.equals(geom.coordinates[1][0][0], 300010);
        assert.equals(geom.coordinates[1][0][1], 7000010);
    });

    it('should be able to write to TopoJSON', function () {
        var sosidata = parser.parse(data);
        var name = 'testdata';
        var json =  sosidata.dumps('topojson', name);
        assert(json);

        assert.equals(json.type, 'Topology');
        assert.equals(json.objects[name].type, 'GeometryCollection');

        assert.equals(json.objects[name].geometries.length, 11);

        var geom10 = json.objects[name].geometries[10];

        assert.equals(geom10.type, 'Polygon');

        assert.equals(geom10.properties.id, 600);
        assert.equals(geom10.properties.objekttypenavn, 'Mahogney');
        assert.equals(typeof geom10.properties.kvalitet.målemetode, 'number');
        assert.equals(geom10.properties.kvalitet.målemetode,  82);

        assert.equals(geom10.arcs.length, 2);
        assert.equals(geom10.arcs[0].length, 4);

        var shell10 = geom10.arcs[0];
        assert.equals(shell10[0], 0);
        assert.equals(shell10[1], 1);
        assert.equals(shell10[2], 2);
        assert.equals(shell10[3], 3);

        assert.equals(geom10.arcs[1].length, 4);
        var hole10 = geom10.arcs[1];
        assert.equals(hole10[0], 4);
        assert.equals(hole10[1], 5);
        assert.equals(hole10[2], 6);
        assert.equals(hole10[3], 7);


        var geom9 = _.find(json.objects[name].geometries, function (g){
            return g.properties.id === 400;
        });

        assert.equals(geom9.type, 'Polygon');

        assert.equals(geom9.properties.id, 400);
        assert.equals(geom9.properties.objekttypenavn, 'Mahogney');
        assert.equals(geom9.properties.kvalitet.målemetode, 82);

        assert.equals(geom9.arcs.length, 2);
        assert.equals(geom9.arcs[0].length, 4);


        var shell9 = geom9.arcs[0];
        assert.equals(shell9[0], 0);
        assert.equals(shell9[1], 1);
        assert.equals(shell9[2], 2);
        assert.equals(shell9[3], 3);

        assert.equals(geom9.arcs[1].length, 4);
        var hole9 = geom9.arcs[1];
        assert.equals(hole9[0], 4);
        assert.equals(hole9[1], 5);
        assert.equals(hole9[2], 6);
        assert.equals(hole9[3], 7);

        assert(json.arcs);
        assert.equals(json.arcs.length, 8);
        assert.equals(json.arcs[0][0][0], 300000);
        assert.equals(json.arcs[0][0][1], 7000000);
        assert.equals(json.arcs[0][1][0], 300000);
        assert.equals(json.arcs[0][1][1], 7001000);

        assert.equals(json.arcs[1][0][0], 300000);
        assert.equals(json.arcs[1][0][1], 7001000);
        assert.equals(json.arcs[1][1][0], 301000);
        assert.equals(json.arcs[1][1][1], 7001000);

        assert.equals(json.arcs[2][0][0], 301000);
        assert.equals(json.arcs[2][0][1], 7001000);
        assert.equals(json.arcs[2][1][0], 301000);
        assert.equals(json.arcs[2][1][1], 7000000);

        assert.equals(json.arcs[3][0][0], 301000);
        assert.equals(json.arcs[3][0][1], 7000000);
        assert.equals(json.arcs[3][1][0], 300000);
        assert.equals(json.arcs[3][1][1], 7000000);

        assert.equals(json.arcs[4][0][0], 300010);
        assert.equals(json.arcs[4][0][1], 7000010);
        assert.equals(json.arcs[4][1][0], 300010);
        assert.equals(json.arcs[4][1][1], 7000020);

        assert.equals(json.arcs[5][0][0], 300010);
        assert.equals(json.arcs[5][0][1], 7000020);
        assert.equals(json.arcs[5][1][0], 300020);
        assert.equals(json.arcs[5][1][1], 7000020);

        assert.equals(json.arcs[6][0][0], 300020);
        assert.equals(json.arcs[6][0][1], 7000020);
        assert.equals(json.arcs[6][1][0], 300020);
        assert.equals(json.arcs[6][1][1], 7000010);

        assert.equals(json.arcs[7][0][0], 300020);
        assert.equals(json.arcs[7][0][1], 7000010);
        assert.equals(json.arcs[7][1][0], 300010);
        assert.equals(json.arcs[7][1][1], 7000010);
    });
});
