var Collision = require('../app/collision');
var expect = require('chai').expect;
var sinon = require('sinon');
var Entity = require("../app/entity");
var RigidBody = require("../app/components/rigidbody");
var THREE = require("THREE");
var CollisionBody = require("../app/components/collisionbody");

describe("Collision", function() {
    var collision, mockCollision, game, entities;

    beforeEach(function() {
        collision = new Collision();
        mockCollision = sinon.mock(collision);
        entities = [];
        game = {
            getEntities: function() {
                return entities;
            }
        };
        collision.parent = game;
    });

    describe("#update", function() {
        it("should hit test bodies and notify", function() {
            var entity1 = createMockCollidable();
            var entity2 = createMockCollidable();
            var body1 = entity1.collisionBody;
            var body2 = entity2.collisionBody;

            var mockBody1 = sinon.mock(body1);

            entities = [entity1, entity2];

            mockCollision.expects("notifyCollision").withArgs(body1, body2);
            collision.update();
            mockCollision.verify();
        });
    });

    function createMockCollidable(params) {
        params = params || {};

        var entity = new Entity();
        var body = new CollisionBody();
        entity.collisionBody = body;

        body.hitTest = function(body) {
            return {
                result: true
            };
        };

        body.shouldResolveHitTest = function(body) {
            return params.shouldResolveHitTestResult != null ?
                params.shouldResolveHitTestResult : true;
        };

        entity.addComponent(body);
        return entity;
    }
});