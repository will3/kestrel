var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var Game = require("../app/game");

describe('Game', function() {
    var game, entityRunner, mockEntityRunner, entity, mockEntity;

    beforeEach(function() {
        entityRunner = {
            addEntity: function() {},
            removeEntity: function() {}
        };
        mockEntityRunner = sinon.mock(entityRunner);
        entity = {
            destroy: function() {}
        };
        mockEntity = sinon.mock(entity);
        game = new Game();
        game.entityRunner = entityRunner;
    });

    describe("#seedRandom", function() {
        it("should generate same number", function() {
            game.seedRandom("kestrel");
            var random1 = Math.random();
            game.seedRandom("kestrel");
            var random2 = Math.random();
            expect(random1).to.equal(random2);
        });
    });

    describe('addEntity', function() {
        it('should add entity', function() {
            mockEntityRunner.expects("addEntity").withArgs(entity);

            game.addEntity(entity);

            mockEntityRunner.verify();
        });
    });

    describe('removeEntity', function() {
        it('should remove and destroy entity', function() {
            mockEntity.expects("destroy");
            mockEntityRunner.expects("removeEntity").withArgs(entity);

            game.removeEntity(entity);

            mockEntity.verify();
            mockEntityRunner.verify();
        });
    });

    describe('#getEntityNamed', function() {
        it('should return entity with name', function() {
            var expectedEntity = entityWithName("name1");
            entityRunner.entities = [
                expectedEntity
            ];

            expect(game.getEntityNamed("name1")).to.equal(expectedEntity);
        });

        it('should throw when entity not found', function() {
            entityRunner.entities = [];

            expect(function() {
                game.getEntityNamed("name1")
            }).to.throw("cannot find entity with name: name1");
        });

        it('should throw when more than one entity found', function() {
            entityRunner.entities = [
                entityWithName("name1"),
                entityWithName("name1")
            ];

            expect(function() {
                game.getEntityNamed("name1")
            }).to.throw("more than one entity with name: name1 found");
        });
    });

    describe("getEntities", function() {
        it("should return entities with name", function() {
            entityRunner.entities = [
                entityWithName("name1"),
                entityWithName("name1")
            ];


            expect(game.getEntities({
                name: "name1"
            }).length).to.equal(2);
        });

        it("should return all entities without filter", function() {
            entityRunner.entities = [
                entityWithName("name1"),
                entityWithName("name2"),
                entityWithName("name3")
            ];

            expect(game.getEntities().length).to.equal(3);
        });
    });

    describe("nameEntity", function() {
        it("should increment id with same name", function() {
            var entity1 = {};
            var entity2 = {};

            game.nameEntity("ship", entity1);
            game.nameEntity("ship", entity2);

            expect(entity1.name).to.equal("ship0");
            expect(entity2.name).to.equal("ship1");
        });
    });

    function entityWithName(name) {
        var entity = {};
        entity.name = name;

        return entity;
    }
});