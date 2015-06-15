var BlockChunk = require("./blockchunk");

var BlockChunkUtils = function() {
    return {
        //smoke test contiguous
        checkContiguous: function(chunk) {
            var count = 0;
            if(chunk.blockCount == 0){
                return true;
            }

            var firstBlock = chunk.getFirstBlock();

            this._visitBlocksContiguous(chunk, firstBlock.x, firstBlock.y, firstBlock.z, function(block, x, y, z) {
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

                this._visitBlocksContiguous(chunk, firstResult.x, firstResult.y, firstResult.z, function(block, x, y, z) {
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

        _visitBlocksContiguous: function(chunk, x, y, z, callback) {
            var detail = this._getDetail(chunk, x, y, z);
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
                    this._getDetail(chunk, next.x - 1, next.y, next.z, visited),
                    this._getDetail(chunk, next.x + 1, next.y, next.z, visited),
                    this._getDetail(chunk, next.x, next.y - 1, next.z, visited),
                    this._getDetail(chunk, next.x, next.y + 1, next.z, visited),
                    this._getDetail(chunk, next.x, next.y, next.z - 1, visited),
                    this._getDetail(chunk, next.x, next.y, next.z + 1, visited)
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

        _getDetail: function(chunk, x, y, z, visited) {
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

module.exports = BlockChunkUtils;