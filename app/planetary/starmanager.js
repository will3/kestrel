var Entity = require("../entity");
var Star = require("./star");
var THREE = require("THREE");

var StarManager = function() {
    this.stars = null;
}

StarManager.prototype = Object.create(Entity);
StarManager.prototype.constructor = StarManager;

StarManager.prototype.start = function() {
    this.initStars();
};

StarManager.prototype.initStars = function() {
    var size = 1000;
    var number = 1000;

    var stars = [];
    for (var i = 0; i < number; i++) {
        var star = new Star(new THREE.Vector3(
            Math.random() * size,
            Math.random() * size,
            Math.random() * size));
        stars.push(star);
    }
    this.stars = stars;
};

StarManager.prototype.update = function() {

};

module.exports = StarManager;