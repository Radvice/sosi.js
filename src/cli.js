if (!(typeof require == "undefined")) { /* we are running inside nodejs */
    var fs = require("fs");
    var util = require("util");

    var parser = new SOSI.Parser();

    if (process.argv.length < 6) {
        util.print("\nusage: nodejs SOSI.js.js format source_projection target_projection infile.sos > outfile\n\n"
            + "where: format     : one of [" + parser.getFormats() + "]\n"
            + "       source_projection target_projection : projections passed directly to proj4"
            + "       infile.sos : a file in SOSI format\n"
            + "       outfile    : an output file name, omit for stdout\n\n"
            );
        process.exit(1);
    }

    var format   = process.argv[2],
        sourceProjection = process.argv[3],
        targetProjection = process.argv[4],
        filename = process.argv[5];

    function convert(data, format) {
        var json = parser.parse(data).dumps(format, sourceProjection, targetProjection);
        return JSON.stringify(json); /* only for GeoJSON or TopoJSON */
    }

    var data = fs.readFileSync(filename, "utf8");

    var encoding = data.substring(0, 500).match(/TEGNSETT.*/).toString();
    encoding = encoding.split(/\s+/)[1].match(/\S+/).toString(); //sprit at white space, trim
    if (encoding && encoding !== "UTF8") { /* if unlike UTF8, we need iconv, but only then */
        var Iconv = require("iconv").Iconv; /* needed for non UTF8 encodings */
        var converter = new Iconv(encoding, "UTF-8");
        data = fs.readFileSync(filename, encoding = null);
        data = converter.convert(data).toString();
    }
    util.print(convert(data, format));
}