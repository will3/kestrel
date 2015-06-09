var ParticleSystem = require("../../app/entities/particlesystem");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");

describe("ParticleSystem", function() {
    var particleSystem, root, parent;

    beforeEach(function() {
        particleSystem = new ParticleSystem();
        root = {
            addEntity: function() {}
        };
        parent = {};
        parent.parent = root;
        particleSystem.parent = parent;
    });

    it("set up root & parent properly", function() {
        expect(particleSystem.root).to.equal(root);
        expect(particleSystem.parent).to.equal(parent);
    });

    describe("#emit", function() {
        it("#should add point sprite to root", function() {
            var mockRoot = sinon.mock(root);
            particleSystem.position = new THREE.Vector3(0, 1, 2);
            particleSystem.velocity = new THREE.Vector3(3,4,5);
            particleSystem.size = 6;
            particleSystem.life = 7;

            mockRoot.expects("addEntity").withArgs(sinon.match(function(sprite) {
                return sprite.position.equals(new THREE.Vector3(0, 1, 2)) &&
                    sprite.velocity.equals(new THREE.Vector3(3, 4, 5)) &&
                    sprite.size == 6 &&
                    sprite.life == 7;
            }));

            particleSystem.emit();
            
            mockRoot.verify();
        });
    });
});