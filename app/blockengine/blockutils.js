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
        }
    };
}();

module.exports = BlockUtils;