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

        //smoke test contiguous
        checkContiguous: function(chunk) {
            var count = 0;
            if(chunk.blockCount == 0){
                return true;
            }

            var firstBlock = chunk.getFirstBlock();

            this.visitBlocksContiguous(chunk, firstBlock.x, firstBlock.y, firstBlock.z, function(block, x, y, z) {
                count++;
            });

            return (count == chunk.blockCount);
        },

        //get contiguous groups
        getContiguousGroups: function(chunk) {
            //construct block mapping
            var total = 0;
            var tempChunk = new BlockChunk(chunk.origin, chunk.size);

            chunk.visitBlocks(function(block, x, y, z) {
                tempChunk.add(x, y, z, block);
                total++;
            });

            var groups = [];
            var count = 0;
            while (count < total) {
                var firstResult = tempChunk.getFirstBlock();

                var group = [];

                this.visitBlocksContiguous(chunk, firstResult.x, firstResult.y, firstResult.z, function(block, x, y, z) {
                    group.push({
                        block: block,
                        x: x,
                        y: y,
                        z: z
                    });

                    tempChunk.remove(x, y, z);

                    count++;
                });

                if (group.length == 0) {
                    throw "failed to allocate contiguous group";
                }

                groups.push(group);
            }

            return groups;
        },

        visitBlocksContiguous: function(chunk, x, y, z, callback) {
            var detail = this._getBlockDetail(chunk, x, y, z);
            if (detail == null) {
                throw "cannot found block at " + x + " " + y + " " + z;
            }

            var visited = new BlockChunk(chunk.origin, chunk.size);
            visited.add(x, y, z, true);

            var opened = [detail];

            var index = 0;
            while (index < opened.length) {
                var next = opened[index];

                var details = [
                    this._getBlockDetail(chunk, next.x - 1, next.y, next.z, visited),
                    this._getBlockDetail(chunk, next.x + 1, next.y, next.z, visited),
                    this._getBlockDetail(chunk, next.x, next.y - 1, next.z, visited),
                    this._getBlockDetail(chunk, next.x, next.y + 1, next.z, visited),
                    this._getBlockDetail(chunk, next.x, next.y, next.z - 1, visited),
                    this._getBlockDetail(chunk, next.x, next.y, next.z + 1, visited)
                ];

                details.forEach(function(detail) {
                    if (detail != null) {
                        visited.add(detail.x, detail.y, detail.z, true);
                        opened.push(detail);
                    }
                })

                callback(next.block, next.x, next.y, next.z);
                index++;
            }
        },

        _getBlockDetail: function(chunk, x, y, z, visited) {
            if (visited != null) {
                if (visited.get(x, y, z) != null) {
                    return null;
                }
            }
            var block = chunk.get(x, y, z);
            if (block == null) {
                return null;
            }
            return {
                block: block,
                uuid: block.uuid,
                x: x,
                y: y,
                z: z,
            }
        }
    };
}();

module.exports = BlockUtils;