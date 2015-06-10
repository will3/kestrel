var Block = require("./block");
var BlockChunk = require("./blockchunk");
var BlockCoord = require("./blockcoord");
var _ = require("lodash");

var BlockUtils = function() {
    return {
        visitRange: function(center_x, center_y, center_z, radius, callback) {
            for (var distance = 0; distance <= radius; distance++) {
                this.visitDistance(distance, function(x, y, z) {
                    callback(center_x + x, center_y + y, center_z + z, distance);
                }.bind(this));
            }
        },

        visitDistance: function(distance, callback) {
            for (var x = -distance; x <= distance; x++) {
                for (var y = -distance + Math.abs(x); y <= distance - Math.abs(x); y++) {
                    var z1 = distance - Math.abs(x) - Math.abs(y);
                    var z2 = z1 * -1;
                    callback(x, y, z1);
                    if (z1 != z2) {
                        callback(x, y, z2);
                    }
                }
            }
        },

        getChunkFromJson: function(data) {
            var size = Math.pow(2, Math.ceil(Math.log(data.halfSize) / Math.log(2)));
            var chunk = new BlockChunk(new BlockCoord(-size, -size, -size), size * 2);

            data.blocks.forEach(function(block) {
                var coords = _.map(block.split("|"), function(coord) {
                    var components = coord.split(",");
                    return new BlockCoord(
                        parseInt(components[0].trim()),
                        parseInt(components[1].trim()),
                        parseInt(components[2].trim())
                    )
                });

                if (coords.length == 1) {
                    var coord = coords[0];
                    chunk.add(coord.x, coord.y, coord.z, new Block());
                } else if (coords.length == 2) {
                    var coord1 = coords[0];
                    var coord2 = coords[1];

                    for (var x = coord1.x; x <= coord2.x; x++) {
                        for (var y = coord1.y; y <= coord2.y; y++) {
                            for (var z = coord1.z; z <= coord2.z; z++) {
                                chunk.add(x, y, z, new Block());
                            }
                        }
                    }
                }
            });

            return chunk;
        }
    };
}();

module.exports = BlockUtils;