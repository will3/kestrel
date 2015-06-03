var BlockCoord = function(x, y, z) {
    this.type = "BlockCoord";
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

BlockCoord.prototype = {
    constructor: BlockCoord,

    equals: function(coord) {
        if (coord.type != "BlockCoord") {
            throw "must compare with BlockCoord";
        }

        return this.x == coord.x && this.y == coord.y && this.z == coord.z;
    },

    add: function(x, y, z){
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
    },

    copy: function() {
        return new BlockCoord(this.x, this.y, this.z);
    }
}

module.exports = BlockCoord;