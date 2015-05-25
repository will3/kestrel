var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var EntityRunner = require("../app/entityrunner");
var Entity = require("../app/entity");
var injector = require("../app/injector");
var Game = require("../app/game");
injector.loadModule(require("./testmodule"));

describe('Game', function() {
    var game, entityRunner, mockEntityRunner;

    beforeEach(function() {
        entityRunner = injector.get("entityRunner");
        mockEntityRunner = sinon.mock(entityRunner);
        game = new Game();
        game.entityRunner = entityRunner;
    });

    describe('addEntity', function() {
        it('should add entity', function() {
            var entity = new Entity();
            mockEntityRunner.expects("addEntity").withArgs(entity);

            game.addEntity(entity);

            mockEntityRunner.verify();
        });
    });

    describe('removeEntity', function() {
        it('should remove and destroy entity', function() {
            var entity = mockEntity();
            entity.expects("destroy");
            mockEntityRunner.expects("removeEntity").withArgs(entity.object);

            game.removeEntity(entity.object);

            entity.verify();
            mockEntityRunner.verify();
        });
    });

    describe('getEntity', function() {
        it('should return entity with name', function() {
            var entity = mockEntity();
            var expectedEntity = entityWithName("name1");
            entityRunner.entities = [
                expectedEntity
            ];
            expect(game.getEntity("name1")).to.equal(expectedEntity);
        });

        it('should throw when entity not found', function() {
            mockEntityRunner.object.entities = [];
            entityRunner.entities = [];
            expect(function() {
                game.getEntity("name1")
            }).to.throw("cannot find entity with name: name1");
        });

        it('should throw when more than one entity found', function() {
            entityRunner.entities = [
                entityWithName("name1"),
                entityWithName("name1")
            ];
            expect(function() {
                game.getEntity("name1")
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
        var entity1 = new Entity();
        var entity2 = new Entity();

        game.nameEntity("ship", entity1);
        game.nameEntity("ship", entity2);

        expect(entity1.name).to.equal("ship0");
        expect(entity2.name).to.equal("ship1");
    });
});

function mockEntity() {
    return sinon.mock(new Entity());
}

function entityWithName(name) {
    var entity = new Entity();
    entity.name = name;

    return entity;
}
});
