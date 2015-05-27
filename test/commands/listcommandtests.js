var ListCommand = require("../../app/commands/listcommand");
var Game = require("../../app/game");
var sinon = require("sinon");
var expect = require("chai").expect;
var Entity = require("../../app/entity");

describe("ListCommand", function() {
    var listCommand, game;
    beforeEach(function() {
        listCommand = new ListCommand();
        game = new Game();
        listCommand.game = game;
    })

    describe("#execute", function() {
        it("should return names of entities", function() {
        	var entity1 = new Entity();
        	entity1.name = "entity1";
        	var entity2 = new Entity();
        	entity2.name = "entity2";
        	var getEntities = sinon.stub(game, "getEntities").returns([
        		entity1, entity2
        		])
        	game.getEntities = getEntities;
        	var result = listCommand.execute();
        	expect(result).to.equal("entity1, entity2");
        })
    })
});